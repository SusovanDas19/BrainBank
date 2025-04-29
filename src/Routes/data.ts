import Router from "express";
import { Request, Response } from "express";
import { userAuth } from "../middlewares/userAuth";
import { newContentModel, UserModel } from "../Database/db";
import mongoose from "mongoose";

const dataRouter = Router();

dataRouter.post(
  "/add",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.userId || "";
      const { title, description, type, link, tags, date } = req.body;

      if (!title || !description || !type) {
        res
          .status(400)
          .json({ error: "Title, description, and type are required." });
        return;
      }

      // Create new content
      await newContentModel.create({
        title,
        description,
        type,
        link,
        tags,
        userId,
        date,
      });

      res.status(201).json({
        message: "New content created successfully",
      });
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

dataRouter.get(
  "/fetch",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.userId || "";
    const contentType: string = (req.query.type as string) || "";
    const latestId: string = (req.query.latestId as string) || "";

    try {
      const query: any = { type: contentType, userId: userId };

      if (latestId) {
        query._id = { $gt: new mongoose.Types.ObjectId(latestId) };
      }

      const content = await newContentModel.find(query).sort({ _id: -1 });

      if (content) {
        res.status(201).json({
          message: "All content fetched.",
          AllContent: content,
        });
      } else {
        res.status(400).json({
          message: "Unable to fetch all content",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

dataRouter.get(
  "/fetch/recent",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.userId as string;

    const afterId = req.query.afterId as string | undefined;
    const query: any = { userId,
      // type: { $in: ['Youtube', 'Twitter', 'Linkedin'] }
     };

    if (afterId && mongoose.Types.ObjectId.isValid(afterId)) {
      query._id = { $gt: new mongoose.Types.ObjectId(afterId) };
    }

    try {
      const recentPosts = await newContentModel
        .find(query)
        .sort({ _id: -1 })
        .limit(15)
        .lean();

      if (recentPosts.length > 0) {
        res.status(200).json({
          message: "Recent posts fetched successfully",
          recentPosts: recentPosts,
        });
        return;
      } else {
        res.status(204).json({ message: "No recent posts found." });
      }
    } catch (e) {
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

dataRouter.delete(
  "/remove",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.userId || "";
    const { contentId } = req.body;

    try {
      const isValidContentId = await newContentModel.findOne({
        _id: contentId,
      });
      if (!isValidContentId) {
        res.status(400).json({
          message: "Contetnt does not found",
        });
        return;
      }

      await newContentModel.deleteOne({ _id: contentId, userId: userId });

      res.status(200).json({
        message: "Content removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

export default dataRouter;
