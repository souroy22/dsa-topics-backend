import { Request, Response } from "express";
import getUserData from "../utils/getUserByEmail";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User.model";

const userControllers = {
  getUser: async (req: Request, res: Response) => {
    try {
      const user: HydratedDocument<IUser> = await getUserData(
        req.user.user.email
      );
      if (!user) {
        return res.status(404).json({ error: "No Such user found" });
      }
      return res.status(200).json({
        user: {
          firstName: user.firstName,
          email: user.email,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default userControllers;
