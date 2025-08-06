import { Router, Request, Response } from "express";
import crypto from "crypto";
import {
  ShareBrainlinkModel,
  newContentModel,
  OrgModel,
  UserModel,
} from "../Database/db";
import { anyAuth } from "../middlewares/anyAuth";

const shareRouter = Router();
const frontendUrl: string = process.env.BASE_URL || "http://localhost:5173";


shareRouter.post(
  "/fetch/link",
  anyAuth,
  async (req: Request, res: Response): Promise<void> => {
    const actorId: string = req.actorId || "";
    const type: string = req.body.type; // "personal" or "organization"

    if (!actorId || !type) {
      res.status(400).json({ message: "Invalid user/org ID or type" });
      return;
    }

    try {
      // Corrected query to use 'type' field
      let existingLink = await ShareBrainlinkModel.findOne({ userId: actorId, type });
      let hash: string;

      if (!existingLink) {
        // Use crypto for a more secure and unique hash
        hash = crypto.randomBytes(16).toString("hex");
        await ShareBrainlinkModel.create({
          hash: hash,
          userId: actorId,
          type: type,
        });
      } else {
        hash = existingLink.hash;
      }

      const profileLink = `${frontendUrl}/share/brain/show/${hash}`;

      res.status(200).json({
        message: "Share link generated",
        link: profileLink,
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

shareRouter.delete(
  "/remove/link/:type",
  anyAuth,
  async (req: Request, res: Response) => {
    const actorId: string = req.actorId || "";
    const type = req.params.type; // "personal" or "organization"

    if (!actorId) {
      res.status(400).json({ message: "Invalid user/org ID" });
      return;
    }

    try {
      const deleteLink = await ShareBrainlinkModel.findOneAndDelete({
        userId: actorId,
        type: type,
      });

      if (!deleteLink) {
        res.status(404).json({ message: "No active share link found to deactivate" });
        return;
      }

      res.status(200).json({ message: "Share link deactivated successfully" });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

shareRouter.get(
  "/show/:hash",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { hash } = req.params;
      const linkDetails = await ShareBrainlinkModel.findOne({ hash });

      if (!linkDetails) {
        res.status(404).json({ message: "Share link not found or has been deactivated." });
        return;
      }

      // The 'userId' from the link schema holds the ID for either the user or the organization
      const contentOwnerId = linkDetails.userId;
      let username: string | undefined;
      
      if (linkDetails.type === "personal") {
        const user = await UserModel.findById(contentOwnerId).select("username");
        username = user?.username;
      } else if (linkDetails.type === "organization") {
        const org = await OrgModel.findById(contentOwnerId).select("OrgName");
        username = org?.OrgName;
      }

      if (!username) {
        res.status(404).json({ message: "Owner of this content could not be found." });
        return;
      }
      
      // Fetch all content associated with that user or organization ID
      const data = await newContentModel
        .find({ userId: contentOwnerId })
        .select("-userId -__v")
        .lean();

      res.status(200).json({
        username: username,
        user: data,
        type: linkDetails.type
      });
    } catch (e) {
      console.error("Error showing share link content:", e);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default shareRouter;
