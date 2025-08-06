import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ShareBrainlinkModel } from "../Database/db";

const jwtOrgKey: string = process.env.JWT_ORG_KEY!;

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      orgId?: string;
      userId?: string;
    }
  }
}

// Extend jwt JwtPayload to include userId
declare module "jsonwebtoken" {
  export interface CustomJwtPayload extends JwtPayload {
    orgId?: string;
  }
}

export const orgAuth = async (req: Request, res: Response, next: NextFunction):  Promise<void> => {
  const token: string = req.headers.authorization || "";
  const hash: string = req.body.hash

  if(hash && !token){
    const user = await ShareBrainlinkModel.find({hash});
    if(user) return next();
    res.status(404).json({ message: "Share link not found" });
    return
  }

  if (!token && !hash) {
    res.status(401).json({ message: "Token missing, authorization denied" });
    return;
  }

  try {
    const { orgId } = <jwt.CustomJwtPayload>jwt.verify(token, jwtOrgKey);

    if (orgId) {
      req.orgId = orgId;
      next();
    } else {
      res.status(403).json({ message: "You are not logged in" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};
