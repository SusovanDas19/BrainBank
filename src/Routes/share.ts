import Router from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userAuth } from "../middlewares/userAuth";
import { linkModel, newContentModel, UserModel } from "../Database/db";
import { randomHash } from "../utils/randomHash";
const shareRouter = Router();

const shareLinkKey: string = process.env.JWT_SHARE_LINK_KEY || "ABfgk8912";

shareRouter.post(
  "/link",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.userId || "";

    try {
      const hash = randomHash(10);
      const profileLink = `http://localhost:5000/v1/share/details/${hash}`;
      await linkModel.create({
        hash: hash,
        userId: userId
      })
      res.status(200).send({
        message: "Share link generated",
        hash: hash,
        link: profileLink,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
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
        error: error
      });
    }
  }
);

export default shareRouter;
