import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userAuth } from "../middlewares/userAuth";
import { linkModel, newContentModel, UserModel } from "../Database/db";
import { randomHash } from "../utils/randomHash";

const shareRouter = Router();
const shareLinkKey: string = process.env.JWT_SHARE_LINK_KEY || "ABfgk8912";
const baseUrl: string = process.env.BASE_URL || "http://localhost:5000";

shareRouter.post(
  "/link",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.userId || "";

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
        await linkModel.create({ hash, userId });
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
  userAuth,
  async (req: Request, res: Response) => {
    const userId: string = req.userId || "";

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
  "/details/:shareToken",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { shareToken } = req.params;
      const decoded = jwt.verify(shareToken, shareLinkKey) as jwt.JwtPayload;
      const userId = decoded.userId;

      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(400).json({
          message: "Link of the user does not exist",
        });
        return;
      }

      const allUserContent = await newContentModel
        .find({ userId })
        .populate("userId", "username -_id");

      if (allUserContent) {
        res.status(200).json({
          message: "All content of the user fetched",
          allContent: allUserContent,
        });
        return;
      } else {
        res.status(400).json({
          message: "Unable to fetch all content",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error,
      });
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

      const userData = await newContentModel
        .find({ userId: fetchUserId.userId })
        .select("-userId -__v")
        .lean();

      if (!userData) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        user: userData,
      });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default shareRouter;
