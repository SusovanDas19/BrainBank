import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ShareBrainlinkModel } from "../Database/db";

const jwtUserKey = process.env.JWT_USER_KEY!;
const jwtOrgKey = process.env.JWT_ORG_KEY!;

declare global {
  namespace Express {
    interface Request {
      actorId?: string;
    }
  }
}

export const anyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization || "";
  const hash = req.body.hash;

  if (hash && !token) {
    const user = await ShareBrainlinkModel.findOne({ hash });
    user ? next() : res.status(404).json({ message: "Share link not found" });
    return;
  }

  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  //try user-token
  try {
    const { userId } = jwt.verify(token, jwtUserKey) as any;
    if (userId) {
      req.actorId = userId;
      return next();
    }
  } catch (_e) {}

  //try org-token
  try {
    const { orgId } = jwt.verify(token, jwtOrgKey) as any;
    if (orgId) {
      req.actorId = orgId;
      return next();
    }
  } catch (_e) {}

  res.status(403).json({ message: "Invalid or expired token" });
};
