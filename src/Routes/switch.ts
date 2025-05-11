import { Router, Request, Response } from "express";
import { orgAuth } from "../middlewares/orgAuth";
import { OrgModel, UserModel } from "../Database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userAuth } from "../middlewares/userAuth";
const jwtUserKey: string = process.env.JWT_USER_KEY || "abjcdsj45";
const jwtOrgKey: string = process.env.JWT_ORG_KEY || "abjcdsj45";

const switchRouter = Router();

switchRouter.post(
  "/user/signin",
  orgAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { username, password, OrgName } = req.body;
    const orgId = req.orgId;

    if (!username || !password || !OrgName) {
      res.status(400).send({
        message: "Password is required",
      });
      return;
    }

    try {
      const user = await UserModel.findOne({
        username,
      });

      if (!user) {
        res.status(400).send({
          message: "Invalid Username",
        });
        return;
      }

      //is  the user is in this org
      const org = await OrgModel.findOne({
        _id: orgId,
        userId: user._id,
      });

      if (!org) {
        res.status(400).json({ message: "Organization and user mismatch" });
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
    } catch (e) {
      res.status(500).send({
          message: "Internal server error",
        });
    }
  }
);

switchRouter.post(
  "/org/signin",
  userAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { OrgPassword, OrgName } = req.body;
    const userId = req.userId;

    if (!OrgPassword || !OrgName) {
      res.status(400).send({
        message: "OrgName and OrgPassword is required",
      });
      return;
    }

    try {
      const user = await UserModel.findById(userId);


      if (!user) {
        res.status(400).send({
          message: "Invalid user",
        });
        return;
      }

      const org = await OrgModel.findOne({
        OrgName: OrgName,
      });


      if (!org) {
        res.status(400).send({
          message: "Invalid Organization Name",
        });
        return;
      }

      //is  the user is in this org
      const isInThisOrg = await OrgModel.findOne({
        _id: org._id,
        userId: userId,
      });


      if (!isInThisOrg) {
        res
          .status(400)
          .json({ message: "Your are not belongs to this Organization" });
        return;
      }

      const validPassword: boolean = await bcrypt.compare(
        OrgPassword,
        isInThisOrg.OrgPassword
      );


      if (validPassword) {
        const token: string = jwt.sign(
          {
            orgId: org._id.toString(),
          },
          jwtOrgKey
        );

        res.status(200).send({
          message: "Signin Complete",
          OrgName: OrgName,
          token: token,
        });
        return;
      } else {
        res.status(400).send({
          message: "Invalid Credentials",
        });
        return;
      }
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default switchRouter;
