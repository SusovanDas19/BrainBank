import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { linkModel } from "../Database/db";

const jwtUserKey: string = process.env.JWT_USER_KEY!;

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Extend jwt JwtPayload to include userId
declare module "jsonwebtoken" {
  export interface CustomJwtPayload extends JwtPayload {
    userId?: string;
  }
}

export const userAuth = async (req: Request, res: Response, next: NextFunction):  Promise<void> => {
  const token: string = req.headers.authorization || "";
  const hash: string = req.body.hash

  if(hash && !token){
    const user = await linkModel.find({hash});
    if(user) return next();
    res.status(404).json({ message: "Share link not found" });
    return
  }

  if (!token && !hash) {
    res.status(401).json({ message: "Token missing, authorization denied" });
    return;
  }

  try {
    const { userId } = <jwt.CustomJwtPayload>jwt.verify(token, jwtUserKey);


    if (userId) {
      req.userId = userId;
      next();
    } else {
      res.status(403).json({ message: "You are not logged in" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};
