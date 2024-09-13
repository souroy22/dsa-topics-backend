import express from "express";
import checkMissingFields from "../middlewares/checkMissingFields";
import topicControllers from "../controllers/topic.controllers";
import verifyToken from "../middlewares/verifyToken";
import checkIsAdmin from "../middlewares/checkIsAdmin";
import { paginateMiddleware } from "../utils/pagination";

const topicRouter = express.Router();

topicRouter.post(
  "/create",
  verifyToken,
  checkMissingFields("CREATE_TOPIC"),
  checkIsAdmin,
  topicControllers.createTopic
);

topicRouter.get(
  "/all",
  verifyToken,
  paginateMiddleware,
  topicControllers.getTopics
);

topicRouter.patch(
  "/update/:slug",
  verifyToken,
  checkIsAdmin,
  topicControllers.updateTopic
);

topicRouter.delete(
  "/delete/:slug",
  verifyToken,
  checkIsAdmin,
  topicControllers.deleteTopic
);

export default topicRouter;
