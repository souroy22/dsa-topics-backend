"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const user_controllers_1 = __importDefault(require("../controllers/user.controllers"));
const userRouter = express_1.default.Router();
userRouter.get("/get-user", verifyToken_1.default, user_controllers_1.default.getUser);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map