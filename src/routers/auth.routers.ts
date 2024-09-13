import express from "express";
import checkMissingFields from "../middlewares/checkMissingFields";
import authControllers from "../controllers/auth.controllers";
import validateEmail from "../middlewares/validateEmailId";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  checkMissingFields("SIGNUP"),
  validateEmail,
  authControllers.signup
);
authRouter.post(
  "/signin",
  checkMissingFields("SIGN_IN"),
  authControllers.signin
);

export default authRouter;
