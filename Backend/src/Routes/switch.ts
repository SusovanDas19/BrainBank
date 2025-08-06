import { Router, Request, Response } from "express";
import { orgAuth } from "../middlewares/orgAuth";
import { OrgModel, UserModel } from "../Database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userAuth } from "../middlewares/userAuth";
import { Types } from "mongoose";
import { boolean } from "zod";
const jwtUserKey: string = process.env.JWT_USER_KEY || "abjcdsj45";
const jwtOrgKey: string = process.env.JWT_ORG_KEY || "abjcdsj45";

const switchRouter = Router();

switchRouter.post(
  //org to personal profile
  "/user/signin",
  orgAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { username, password, OrgName, userType } = req.body;
    const orgId = req.orgId;

    if (!username || !password || !OrgName) {
      res.status(400).send({
        message: "Password is required",
      });
      return;
    }

    try {
      const user = await UserModel.findOne({
        username,
      });

      if (!user) {
        res.status(400).send({
          message: "Invalid Username",
        });
        return;
      }

      const org = await OrgModel.findById(orgId).exec();
      if (!org) {
        res.status(400).json({ message: "Organization not found" });
        return;
      }


      const validPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );

      if (validPassword) {
        const token: string = jwt.sign(
          {
            userId: user._id.toString(),
          },
          jwtUserKey
        );

        res.status(200).send({
          message: "Signin Complete",
          username: username,
          token: token,
        });
        return;
      } else {
        res.status(400).send({
          message: "Invalid Credentials",
        });
      }
    } catch (e) {
      res.status(500).send({
        message: "Internal server error",
      });
    }
  }
);

switchRouter.post(
  // personal profile to org
  "/org/signin",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { OrgName, password } = req.body;
    const userId = req.userId;

    if (!OrgName || !password) {
      res.status(404).json({ message: "OrgName and password are required" });
      return;
    }

    try {
      const anyAffiliation = await OrgModel.findOne({
        $or: [
          { createdBy: userId },
          { admins: userId },
          { members: userId },
        ],
      });

      // If no affiliation is found, provide an early exit.
      if (!anyAffiliation) {
        res.status(400).json({
          message: "You are not affiliated with any organization. Please create one first.",
        });
        return;
      }

      // --- Original logic proceeds if the user is part of at least one org ---

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Invalid user" });
        return;
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid Credentials" });
        return;
      }

      const org = await OrgModel.findOne({ OrgName: OrgName });

      if (!org) {
        res.status(404).json({ message: "The specified organization was not found" });
        return;
      }

      let type: string = "";
      if (org.createdBy.equals(userId)) {
        type = "Creator";
      } else if (org.admins.some((a) => a.equals(userId))) {
        type = "Admin";
      } else if (org.members.some((m) => m.equals(userId))) {
        type = "Member";
      }

      if (!type) {
        res.status(403).json({ message: "You are not a member of this specific organization" });
        return;
      }

      const token: string = jwt.sign(
        { orgId: org._id.toString() },
        jwtOrgKey
      );
      
      res.status(200).json({
        message: "Signin Complete",
        OrgName: OrgName,
        token: token,
        type: type,
      });
    } catch (e) {
      console.error("Org sign-in error:", e);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default switchRouter;
