import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../Database/db";

const hashRound: number = parseInt(process.env.HASHROUND || "10", 10);
const jwtUserKey: string = process.env.JWT_USER_KEY || "abjcdsj45";

const userRouter = Router();

// Define the Zod schema
export const validBodySchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Too short username" })
      .max(20, { message: "Max 20 characters allowed" }),
    password: z
      .string()
      .min(6, { message: "Too short password" })
      .max(25, { message: "Max 25 characters allowed" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Add one uppercase letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Add one lowercase letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Add one number",
      })
      .refine((password) => /[!@#$%^&*.]/.test(password), {
        message: "Add a special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });


userRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    const parsedBody = validBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = parsedBody.error.issues[0]?.message || "Invalid input";
      res.status(400).json({ message: `Validation error: ${error}` });
      return;
    }

    const { username, password } = parsedBody.data;

    try {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        res.status(400).send({ message: "Username already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, hashRound);
      const newUser = await UserModel.create({
        username: username,
        password: hashedPassword,
      });
      res.status(201).send({ message: "Signup Complete" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

userRouter.post(
  "/signin",
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(404).send({
        message: "Username and Password required",
      });
      return;
    }
    try {
      const user = await UserModel.findOne({
        username: username,
      });
      if (!user) {
        res.status(400).send({
          message: "Invalid Username",
        });
        return;
      }

      const validPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );
      if (validPassword) {
        const token: string = jwt.sign(
          {
            userId: user._id.toString(),
          },
          jwtUserKey
        );

        res.status(200).send({
          message: "Signin Complete",
          username: username,
          token: token,
        });
        return;
      } else {
        res.status(400).send({
          message: "Invalid Credentials",
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Internal Server error",
      });
    }
  }
);

export default userRouter;
