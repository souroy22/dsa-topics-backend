import express from "express";
import verifyToken from "../middlewares/verifyToken";
import userControllers from "../controllers/user.controllers";

const userRouter = express.Router();

userRouter.get("/get-user", verifyToken, userControllers.getUser);

export default userRouter;
