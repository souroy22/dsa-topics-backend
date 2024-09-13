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
const getUserByEmail_1 = __importDefault(require("../utils/getUserByEmail"));
const checkIsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
    if (!user) {
        return res.status(400).json({ error: "No such user found!" });
    }
    if (user.role !== "ADMIN") {
        return res.status(400).json({ error: "Access denied!" });
    }
    next();
});
exports.default = checkIsAdmin;
//# sourceMappingURL=checkIsAdmin.js.map