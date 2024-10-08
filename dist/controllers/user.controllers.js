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
const userControllers = {
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
            if (!user) {
                return res.status(404).json({ error: "No Such user found" });
            }
            return res.status(200).json({
                user: {
                    firstName: user.firstName,
                    email: user.email,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = userControllers;
//# sourceMappingURL=user.controllers.js.map