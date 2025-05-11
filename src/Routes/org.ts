import { Router, Request, Response } from "express";
import { z } from "zod";
import { OrgModel, UserModel } from "../Database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashRound: number = parseInt(process.env.HASHROUND || "10", 10);
const jwtOrgKey: string = process.env.JWT_ORG_KEY || "abjcdsj45";
const orgRouter = Router();

export const validBodySchema = z.object({
  OrgName: z
    .string()
    .min(2, { message: "Too short organization name" })
    .max(20, { message: "Max 20 characters allowed" }),
  OrgPassword: z
    .string()
    .min(6, { message: "Too short password" })
    .max(25, { message: "Max 25 characters allowed" })
    .regex(/[A-Z]/, { message: "Add one uppercase letter" })
    .regex(/[a-z]/, { message: "Add one lowercase letter" })
    .regex(/[0-9]/, { message: "Add one number" })
    .regex(/[!@#$%^&*.]/, { message: "Add a special character" }),
  username: z.string(),
  password: z.string(),
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

    const { OrgName, OrgPassword, username, password } = parsedBody.data;

    try {
      const user = await findUser(username);
      if (!user) {
        res.status(400).send({ message: "Invalid Username" });
        return;
      }

      const validPassword = await comparePasswords(password, user.password);
      if (!validPassword) {
        res.status(400).send({ message: "Incorrect password" });
        return;
      }

      const existingOrg = await findOrg(OrgName);
      if (existingOrg) {
        res.status(400).send({ message: "Organization name already exists" });

        return;
      }

      const hashedPassword = await bcrypt.hash(OrgPassword, hashRound);
      await OrgModel.create({
        OrgName,
        OrgPassword: hashedPassword,
        userId: user._id.toString(),
      });

      res.status(201).send({ message: "Organization registration successful" });
    } catch {
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

orgRouter.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { OrgName, OrgPassword, username, password } = req.body;

  if (!username || !password || !OrgPassword || !OrgName) {
    res
      .status(400)
      .send({ message: "All username and password needed" });
    return;
  }

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

    const [isOrgPasswordValid, isUserPasswordValid] = await Promise.all([
      comparePasswords(OrgPassword, org.OrgPassword),
      comparePasswords(password, user.password),
    ]);

    if (!isUserPasswordValid){
      res.status(400).send({ message: "Your password is incorrect" });
      return;
    }

    if (org.userId !== user._id.toString()) {
      res
        .status(400)
        .send({ message: "You do not belong to this Organization" });
      return;
    }

    if (isOrgPasswordValid) {
      const token = jwt.sign({ orgId: org._id.toString() }, jwtOrgKey);
      res
        .status(200)
        .send({
          message: "Signin Complete as organization member",
          OrgName,
          username,
          token,
        });
    } else {
      res.status(400).send({ message: "Invalid Credentials" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server error" });
  }
});

export default orgRouter;
