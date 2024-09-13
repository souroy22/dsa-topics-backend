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
const User_model_1 = __importDefault(require("../models/User.model"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const verifyPassword_1 = __importDefault(require("../utils/verifyPassword"));
const authControllers = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { firstName, lastName, email, password, avatar = null, dob, phone, } = req.body;
            const isExist = yield (0, getUserByEmail_1.default)(email);
            if (isExist !== null) {
                return res
                    .status(409)
                    .json({ error: "Email address already exists. Please login." });
            }
            const newUser = new User_model_1.default({
                firstName,
                lastName,
                email,
                password,
                phone,
                avatar,
                dob,
            });
            yield newUser.save();
            const user = {
                email: newUser.email,
                id: newUser.id,
            };
            const token = yield (0, generateToken_1.default)(user);
            return res.status(200).json({
                user: {
                    firstName: newUser.firstName,
                    email: newUser.email,
                    lastName: newUser.lastName,
                    phone: newUser.phone,
                    avatar: newUser.avatar,
                },
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    signin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield (0, getUserByEmail_1.default)(email);
            if (user === null) {
                return res
                    .status(404)
                    .json({ error: "Email ID not found. Please signup." });
            }
            if (!(0, verifyPassword_1.default)(password, user.password)) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const structuredEmployee = {
                email: user.email,
                id: user.id,
            };
            const token = yield (0, generateToken_1.default)(structuredEmployee);
            return res.status(200).json({
                user: {
                    firstName: user.firstName,
                    email: user.email,
                    lastName: user.lastName,
                    phone: user.phone,
                    avatar: user.avatar,
                },
                token,
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
exports.default = authControllers;
//# sourceMappingURL=auth.controllers.js.map