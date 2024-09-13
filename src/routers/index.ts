import express from "express";
import authRouter from "./auth.routers";
import userRouter from "./user.router";
import topicRouter from "./topic.routers";
import questionRouter from "./question.routers";

const routers = express.Router();

routers.use("/auth", authRouter);
routers.use("/user", userRouter);
routers.use("/topic", topicRouter);
routers.use("/question", questionRouter);

export default routers;
