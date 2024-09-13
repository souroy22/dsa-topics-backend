import { NextFunction, Request, Response } from "express";
import getUserData from "../utils/getUserByEmail";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User.model";

const checkIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: HydratedDocument<IUser> = await getUserData(req.user.user.email);
  if (!user) {
    return res.status(400).json({ error: "No such user found!" });
  }
  if (user.role !== "ADMIN") {
    return res.status(400).json({ error: "Access denied!" });
  }
  next();
};

export default checkIsAdmin;
