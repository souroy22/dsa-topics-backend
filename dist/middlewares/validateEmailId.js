"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkValidEmail_1 = __importDefault(require("../utils/checkValidEmail"));
const validateEmail = (req, res, next) => {
    const isValid = (0, checkValidEmail_1.default)(req.body.email);
    if (!isValid) {
        return res.status(400).json({ error: "Invalid email address" });
    }
    next();
};
exports.default = validateEmail;
//# sourceMappingURL=validateEmailId.js.map