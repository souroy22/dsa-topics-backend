import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export type USER_TOKEN_TYPE = {
  email: string;
  id: Types.ObjectId;
};

const genarateToken = async (user: USER_TOKEN_TYPE) => {
  if (!process.env.SECRET_KEY?.trim()) {
    return null;
  }
  const token = await jwt.sign({ user }, process.env.SECRET_KEY, {
    expiresIn: "1d", // expires in 1 Day
  });
  return token;
};

export default genarateToken;
