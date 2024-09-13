"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkMissingFields_1 = __importDefault(require("../middlewares/checkMissingFields"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const checkIsAdmin_1 = __importDefault(require("../middlewares/checkIsAdmin"));
const question_controllers_1 = __importDefault(require("../controllers/question.controllers"));
const pagination_1 = require("../utils/pagination");
const questionRouter = express_1.default.Router();
questionRouter.post("/create", verifyToken_1.default, (0, checkMissingFields_1.default)("CREATE_QUESTION"), checkIsAdmin_1.default, question_controllers_1.default.createQuestion);
questionRouter.get("/all", verifyToken_1.default, pagination_1.paginateMiddleware, question_controllers_1.default.getAllQuestions);
questionRouter.get("/:slug", verifyToken_1.default, question_controllers_1.default.getAllQuestions);
questionRouter.patch("/update/:slug", verifyToken_1.default, question_controllers_1.default.updateQuestion);
questionRouter.delete("/delete/:slug", verifyToken_1.default, checkIsAdmin_1.default, question_controllers_1.default.deleteQuestion);
exports.default = questionRouter;
//# sourceMappingURL=question.routers.js.map