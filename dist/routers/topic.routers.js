"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkMissingFields_1 = __importDefault(require("../middlewares/checkMissingFields"));
const topic_controllers_1 = __importDefault(require("../controllers/topic.controllers"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const checkIsAdmin_1 = __importDefault(require("../middlewares/checkIsAdmin"));
const pagination_1 = require("../utils/pagination");
const topicRouter = express_1.default.Router();
topicRouter.post("/create", verifyToken_1.default, (0, checkMissingFields_1.default)("CREATE_TOPIC"), checkIsAdmin_1.default, topic_controllers_1.default.createTopic);
topicRouter.get("/all", verifyToken_1.default, pagination_1.paginateMiddleware, topic_controllers_1.default.getTopics);
topicRouter.patch("/update/:slug", verifyToken_1.default, topic_controllers_1.default.updateTopic);
topicRouter.delete("/delete/:slug", verifyToken_1.default, checkIsAdmin_1.default, topic_controllers_1.default.deleteTopic);
exports.default = topicRouter;
//# sourceMappingURL=topic.routers.js.map