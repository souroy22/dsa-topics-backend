import { NextFunction, Request, Response } from "express";
import checkForValidEmail from "../utils/checkValidEmail";

const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const isValid = checkForValidEmail(req.body.email);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  next();
};

export default validateEmail;
