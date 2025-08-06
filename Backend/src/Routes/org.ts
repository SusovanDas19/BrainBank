import { Router, Request, Response } from "express";
import { z } from "zod";
import { OrgModel, UserModel } from "../Database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from 'mongoose';


const hashRound: number = parseInt(process.env.HASHROUND || "10", 10);
const jwtOrgKey: string = process.env.JWT_ORG_KEY || "abjcdsj45";
const orgRouter = Router();

export const validBodySchema = z.object({
  OrgName: z
    .string()
    .min(2, { message: "Too short organization name" })
    .max(20, { message: "Max 20 characters allowed" }),
  username: z.string(),
  password: z.string(), //user's profile password 
});

async function findUser(username: string) {
  return await UserModel.findOne({ username });
}

async function findOrg(OrgName: string) {
  return await OrgModel.findOne({ OrgName });
}

async function comparePasswords(inputPassword: string, storedPassword: string) {
  return await bcrypt.compare(inputPassword, storedPassword);
}

orgRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    const parsedBody = validBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      res
        .status(400)
        .json({
          message: `Validation error: ${
            parsedBody.error.issues[0]?.message || "Invalid input"
          }`,
        });
      return;
    }

    const { OrgName, username, password } = parsedBody.data;

    try {
      const user = await findUser(username);
      if (!user) {
        res.status(400).send({ message: "Invalid Username" });
        return;
      }

      const validPassword = await comparePasswords(password, user.password);
      if (!validPassword) {
        res.status(400).send({ message: "Incorrect profile password" });
        return;
      }

      const existingOrg = await findOrg(OrgName);
      if (existingOrg) {
        res.status(400).send({ message: "Organization name already exists" });

        return;
      }
      
      const userId = user._id.toString();
      const newOrg = new OrgModel({
        OrgName: OrgName,
        createdBy: userId, 
      });

      await newOrg.save();

      res.status(201).send({ message: "Organization registration successful" });
    } catch {
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

orgRouter.post("/signin", async (req: Request, res: Response): Promise<void> => {
  

  const parsedBody = validBodySchema.safeParse(req.body);

  if (!parsedBody.success) {
    res
      .status(400)
      .json({
        message: `Validation error: ${
          parsedBody.error.issues[0]?.message || "Invalid input"
        }`,
      });
    return;
  }

  const { OrgName, username, password } = parsedBody.data;

  try {
    const [user, org] = await Promise.all([
      findUser(username),
      findOrg(OrgName),
    ]);

    if (!org){
      res.status(400).send({ message: "Invalid organization name" });
      return;

    }
    if (!user){
      res.status(400).send({ message: "Invalid username" });
      return;
    }

    const isUserPasswordValid = await comparePasswords(password, user.password);


    if (!isUserPasswordValid){
      res.status(400).send({ message: "Your password is incorrect" });
      return;
    }
    
    let type:string = "";

    if (org.createdBy.equals(user._id)) {
      type = 'Creator';
    }
    else if (org.admins.some(a => a.equals(user._id))) {
      type = 'Admin';
    }
    else if (org.members.some(m => m.equals(user._id))) {
      type = 'Member';
    }

    if (!type) {
      res
        .status(400)
        .send({ message: "You do not belong to this Organization" });
      return;
    }

    if (type) {
      const token = jwt.sign({ orgId: org._id.toString() }, jwtOrgKey);
      res
        .status(200)
        .send({
          message: `Signin Complete as organization ${type}`,
          OrgName,
          username,
          token,
          type: type
        });
    } else {
      res.status(400).send({ message: "Invalid Credentials" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server error" });
  }
});

export default orgRouter;
