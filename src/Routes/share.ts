import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userAuth } from "../middlewares/userAuth";
import {
  linkModel,
  newContentModel,
  OrgModel,
  UserModel,
} from "../Database/db";
import { randomHash } from "../utils/randomHash";
import { anyAuth } from "../middlewares/anyAuth";

const shareRouter = Router();
const baseUrl: string = process.env.BASE_URL || "http://localhost:5000";

shareRouter.post(
  "/link",
  anyAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.actorId || "";
    const actorType: string = req.body.type;

    if (!userId) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    try {
      let existingLink = await linkModel.findOne({ userId });
      let hash: string;
      let profileLink: string;

      if (!existingLink) {
        hash = randomHash(10);
        await linkModel.create({
          hash: hash,
          userId: userId,
          userType: actorType,
        });
      } else {
        hash = existingLink.hash;
      }

      profileLink = `${baseUrl}/share/brain/show/${hash}`;

      res.status(200).json({
        message: "Share link generated",
        hash,
        link: profileLink,
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

shareRouter.delete(
  "/link/delete",
  anyAuth,
  async (req: Request, res: Response) => {
    const userId: string = req.actorId || "";

    if (!userId) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    try {
      const deleteLink = await linkModel.findOneAndDelete({ userId });

      if (!deleteLink) {
        res.status(404).json({
          message: "No share link found to deactivate",
        });
        return;
      }

      res.status(200).json({
        message: "Share link deactivated",
      });
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

      const fetchUserId = await linkModel.findOne({ hash });

      if (!fetchUserId) {
        res.status(404).json({ message: "Link not found" });
        return;
      }

      let data = await newContentModel
        .find({ userId: fetchUserId.userId })
        .select("-userId -__v")
        .lean();

      let username;

      if (fetchUserId.userType === "default") {
        const name = await UserModel.findById(fetchUserId.userId).select("username");
        username = name?.username
      } else {
        const name = await OrgModel.findById(fetchUserId.userId).select("OrgName");
        username = name?.OrgName
      }

      if (!data || !username) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      res.status(200).json({
        username: username,
        user: data,
      });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default shareRouter;
