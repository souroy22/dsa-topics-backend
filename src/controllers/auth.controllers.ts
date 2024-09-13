import { Request, Response } from "express";
import getUserData from "../utils/getUserByEmail";
import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/User.model";
import genarateToken, { USER_TOKEN_TYPE } from "../utils/generateToken";
import verifyPassword from "../utils/verifyPassword";

const authControllers = {
  signup: async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        avatar = null,
        phone,
      } = req.body;

      const isExist = await getUserData(email);
      if (isExist !== null) {
        return res
          .status(409)
          .json({ error: "Email address already exists. Please login." });
      }
      const newUser: HydratedDocument<IUser> = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        avatar,
      });
      await newUser.save();
      const user: USER_TOKEN_TYPE = {
        email: newUser.email,
        id: newUser.id,
      };
      const token = await genarateToken(user);
      return res.status(200).json({
        user: {
          firstName: newUser.firstName,
          email: newUser.email,
          lastName: newUser.lastName,
          phone: newUser.phone,
          avatar: newUser.avatar,
          role: newUser.role,
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user: HydratedDocument<IUser> = await getUserData(email);
      if (user === null) {
        return res
          .status(404)
          .json({ error: "Email ID not found. Please signup." });
      }
      if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const structuredEmployee: USER_TOKEN_TYPE = {
        email: user.email,
        id: user.id,
      };
      const token = await genarateToken(structuredEmployee);
      return res.status(200).json({
        user: {
          firstName: user.firstName,
          email: user.email,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default authControllers;
