import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";

export interface IGetUserAuthInfoRequest extends Request {
  user: any;
  token: string;
}

export const verifyToken = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Please provide token" });
    }
    const token = authHeader.split(" ")[1];
    req.token = token;
    await jwt.verify(
      token,
      process.env.SECRET_KEY || "",
      async (error, user) => {
        if (error) {
          return res.status(401).json({
            error: error.message.includes("expired")
              ? "Token expired. Please login"
              : "Invalid token",
          });
        }
        req.user = user;
        const isUserExist = await User.findById(req.user.user.id);
        if (!isUserExist) {
          return res.status(401).json({ error: "Invalid token" });
        }
        next();
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }
};

export default verifyToken;
