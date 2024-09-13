"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ error: "Please provide token" });
        }
        const token = authHeader.split(" ")[1];
        req.token = token;
        yield jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "", (error, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(401).json({
                    error: error.message.includes("expired")
                        ? "Token expired. Please login"
                        : "Invalid token",
                });
            }
            req.user = user;
            const isUserExist = yield User_model_1.default.findById(req.user.user.id);
            if (!isUserExist) {
                return res.status(401).json({ error: "Invalid token" });
            }
            next();
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`Error: ${error.message}`);
            return res.status(500).json({ error: "Something went wrong!" });
        }
    }
});
exports.verifyToken = verifyToken;
exports.default = exports.verifyToken;
//# sourceMappingURL=verifyToken.js.map