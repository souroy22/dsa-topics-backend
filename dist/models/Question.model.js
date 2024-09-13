"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const QuestionSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    level: { type: String, enum: ["EASY", "MEDIUM", "HARD"], default: "EASY" },
    slug: { type: String, required: true, unique: true },
    youtubeLink: { type: String, default: null },
    leetcodeLink: { type: String, default: null },
    articleLink: { type: String, default: null },
    topicId: { type: mongoose_1.Types.ObjectId, ref: "Topic", required: true },
});
const Question = mongoose_1.default.model("Question", QuestionSchema);
exports.default = Question;
//# sourceMappingURL=Question.model.js.map