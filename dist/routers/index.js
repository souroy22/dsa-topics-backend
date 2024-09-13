"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routers_1 = __importDefault(require("./auth.routers"));
const user_router_1 = __importDefault(require("./user.router"));
const topic_routers_1 = __importDefault(require("./topic.routers"));
const question_routers_1 = __importDefault(require("./question.routers"));
const routers = express_1.default.Router();
routers.use("/auth", auth_routers_1.default);
routers.use("/user", user_router_1.default);
routers.use("/topic", topic_routers_1.default);
routers.use("/question", question_routers_1.default);
exports.default = routers;
//# sourceMappingURL=index.js.map