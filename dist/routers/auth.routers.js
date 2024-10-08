"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkMissingFields_1 = __importDefault(require("../middlewares/checkMissingFields"));
const auth_controllers_1 = __importDefault(require("../controllers/auth.controllers"));
const validateEmailId_1 = __importDefault(require("../middlewares/validateEmailId"));
const authRouter = express_1.default.Router();
authRouter.post("/signup", (0, checkMissingFields_1.default)("SIGNUP"), validateEmailId_1.default, auth_controllers_1.default.signup);
authRouter.post("/signin", (0, checkMissingFields_1.default)("SIGN_IN"), auth_controllers_1.default.signin);
exports.default = authRouter;
//# sourceMappingURL=auth.routers.js.map