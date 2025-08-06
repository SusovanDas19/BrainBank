import { Request, Response, Router } from "express";
import { OrgModel, InviteLinkModel, UserModel } from "../Database/db";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { dashAuth } from "../middlewares/dashAuth";
import bcrypt from "bcrypt";


// Initialize the Express router
const mailRouter = Router();

// --- Nodemailer and Google OAuth2 Setup ---
const { MY_EMAIL, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, BASE_URL } =
  process.env;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // The required redirect URI for the playground
);

// Set the permanent refresh token
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// --- Route to Create and Send Organization Invitations ---
mailRouter.post(
  "/invites/send",
  dashAuth, // Use your authentication middleware
  async (req: Request, res: Response): Promise<void> => {
    const { receiverEmail, description, accessNumbers } = req.body;
    const { orgId, userId } = req; // From dashAuth middleware

    // Validate incoming request body
    if (!receiverEmail || !description) {
      res
        .status(400)
        .json({ error: "Receiver email and description are required." });
      return;
    }

    // This variable will hold the ID of the created invite link
    // so we can delete it if the email fails to send.
    let newInviteId: any = null;

    try {
      // 1. Load organization and verify the user is an admin or the creator
      const org = await OrgModel.findById(orgId);
      if (!org) {
        res.status(404).json({ error: "Organization not found." });
        return;
      }

      const isCreator = org.createdBy.toString() === userId;
      const isAdmin = org.admins.map((id) => id.toString()).includes(userId!);

      if (!isCreator && !isAdmin) {
        res.status(403).json({
          error: "You must be an admin or the creator to send invites.",
        });
        return;
      }

      // 2. Get the sender's details to include in the email
      const sender = await UserModel.findById(userId).select("username");
      if (!sender) {
        res
          .status(404)
          .json({ error: "Could not find sender's user profile." });
        return;
      }

      // 3. Generate a unique and secure hash for the invitation link
      const tokenHash = crypto.randomBytes(32).toString("hex");

      // 4. Create and save the new invite link record in the database
      const newInvite = new InviteLinkModel({
        orgId: org._id,
        createdBy: userId,
        tokenHash: tokenHash,
        accessNumbers: accessNumbers || 1, // Default to 1 use if not provided
      });
      await newInvite.save();
      newInviteId = newInvite._id; // Store the ID in case we need to roll back

      // 5. Configure and send the invitation email
      const accessToken = await oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: MY_EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken.token || "",
        },
      } as SMTPTransport.Options);

      // Construct the frontend URL that the user will be sent to
      const joinUrl = `${BASE_URL || "http://localhost:5173"
        }/join-organization?token=${tokenHash}`;

      const mailOptions = {
        from: `BrainBank <${MY_EMAIL}>`,
        to: receiverEmail,
        subject: `You're invited to join ${org.OrgName} on BrainBank`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 10px;">You're Invited!</h2>
            <p>Hello,</p>
            <p><strong>${sender.username}</strong> has invited you to join the <strong>${org.OrgName}</strong> organization on BrainBank.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0056b3; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">"${description}"</p>
            </div>
            <p>A few things to note before you join:</p>
            <ul style="padding-left: 20px; color: #555;">
              <li>You must have an active BrainBank account to join the organization. If you don't have one, the link will guide you to sign up first.</li>
              <li>This invitation link is for you only. Don't share it with anyone</li>
              <li>You have only one chance to join. If you fail, then the link will expire.</li>              
            </ul>
            <p>Click the button below to accept the invitation:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${joinUrl}" style="background-color: #e05e09; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
                Join ${org.OrgName}
              </a>
            </div>
            <p style="margin-top: 25px; font-size: 12px; color: #777; text-align: center;">
              If you did not expect this invitation, you can safely ignore this email.
            </p>
          </div>
        `,
      };

      const result = await transport.sendMail(mailOptions);

      // Checking if the email was rejected by the mail server
      if (result.rejected && result.rejected.length > 0) {
        // If the email failed, delete the invite link we just created to keep the database clean
        await InviteLinkModel.findByIdAndDelete(newInviteId);

        res.status(400).json({
          error:
            "The provided email address is invalid or could not be reached.",
        });
        return;
      }

      // 7. If successful, send a success response to the frontend
      res.status(200).json({ message: "Invitation sent successfully!" });
    } catch (error) {
      // If any other error occurs during the process, attempt to delete the invite
      // if it was created before the error happened.
      if (newInviteId) {
        await InviteLinkModel.findByIdAndDelete(newInviteId);
      }
      console.error("Error sending invite:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
);

//user accepting join request
mailRouter.post(
  "/accept",
  async (req: Request, res: Response): Promise<void> => {
    const { token, username, password } = req.body;

    if (!token || !username || !password) {
      res.status(400).json({ error: "Token, username, and password are required." });
      return;
    }

    try {
      const invite = await InviteLinkModel.findOne({ tokenHash: token });
      if (!invite) {
        res.status(404).json({ error: "Invitation link is invalid or has expired." });
        return;
      }

      const user = await UserModel.findOne({ username });
      if (!user) {
        res.status(404).json({ error: "User not found. Please create a BrainBank account first." });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid username or password." });
        return;
      }

      const org = await OrgModel.findById(invite.orgId);
      if (!org) {
        await InviteLinkModel.deleteOne({ _id: invite._id });
        res.status(404).json({ error: "The organization for this invite no longer exists." });
        return;
      }

      //chcking if the user is already a memeber/admin/creator
      const userIdString = user._id.toString();
      const isAlreadyMember = org.members.some(id => id.toString() === userIdString);
      const isAlreadyAdmin = org.admins.some(id => id.toString() === userIdString);
      const isCreator = org.createdBy.toString() === userIdString;

      if (isAlreadyMember || isAlreadyAdmin || isCreator) {
        res.status(409).json({ error: "You are already a member of this organization." });
        return;
      }

      org.members.push(user._id as any);
      await org.save();

      invite.accessNumbers -= 1;
      if (invite.accessNumbers <= 0) {
        await InviteLinkModel.deleteOne({ _id: invite._id });
      } else {
        await invite.save();
      }

      res.status(200).json({ message: `Successfully joined ${org.OrgName}!` });

    } catch (error) {
      console.error("Error joining organization:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
);

export default mailRouter;
