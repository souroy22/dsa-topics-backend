import express from "express";
import checkMissingFields from "../middlewares/checkMissingFields";
import topicControllers from "../controllers/topic.controllers";
import verifyToken from "../middlewares/verifyToken";
import checkIsAdmin from "../middlewares/checkIsAdmin";
import questionController from "../controllers/question.controllers";
import { paginateMiddleware } from "../utils/pagination";

const questionRouter = express.Router();

questionRouter.post(
  "/create",
  verifyToken,
  checkMissingFields("CREATE_QUESTION"),
  checkIsAdmin,
  questionController.createQuestion
);

questionRouter.get(
  "/all",
  verifyToken,
  paginateMiddleware,
  questionController.getAllQuestions
);

questionRouter.get("/:slug", verifyToken, questionController.getAllQuestions);

questionRouter.patch(
  "/update/:slug",
  verifyToken,
  checkIsAdmin,
  questionController.updateQuestion
);

questionRouter.delete(
  "/delete/:slug",
  verifyToken,
  checkIsAdmin,
  questionController.deleteQuestion
);

export default questionRouter;
