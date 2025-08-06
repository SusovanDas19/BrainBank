// src/middleware/dashAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../Database/db";

const jwtOrgKey: string = process.env.JWT_ORG_KEY!;

// augment Express.Request
// declare global {
//   namespace Express {
//     interface Request {
//       orgId?: string;
//       userId?: string;
//     }
//   }
// }

export const dashAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1) Check for Authorization header
    const token: string = req.headers.authorization || "";
    const { username } = req.body;
    if (!token) {
      res.status(401).json({ error: "Invalid authorization header" });
      return;
    }

    try {
      const { orgId } = <jwt.CustomJwtPayload>jwt.verify(token, jwtOrgKey);

      if (orgId) {
        req.orgId = orgId;
      } else {
        res.status(403).json({ message: "You are not logged in" });
        return;
      }

      if (!username) {
        res.status(400).json({ error: "Missing or invalid username in body" });
        return;
      }
      const user = await UserModel.findOne({ username }).select("_id");
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      req.userId = user._id.toString();
      return next();
    } catch (error) {
      res.status(500).json({ message: "Server error during authentication" });
    }
  } catch (err) {
    console.error("dashAuth error:", err);
    res.status(500).json({ error: "Internal auth error" });
    return;
  }
};
