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
const Question_model_1 = __importDefault(require("../models/Question.model"));
const Topic_model_1 = __importDefault(require("../models/Topic.model"));
const pagination_1 = require("../utils/pagination");
const slugify_1 = __importDefault(require("slugify"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const getUserByEmail_1 = __importDefault(require("../utils/getUserByEmail"));
const questionController = {
    createQuestion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, description, youtubeLink, leetcodeLink, articleLink, level, topicSlug, } = req.body;
            const topic = yield Topic_model_1.default.findOne({ slug: topicSlug });
            if (!topic) {
                return res.status(404).json({ error: "Topic not found!" });
            }
            let slug = (0, slugify_1.default)(title.slice(0, 15).trim(), { lower: true });
            const isExist = yield Question_model_1.default.findOne({ slug });
            if (isExist) {
                const uid = new short_unique_id_1.default({ length: 6 });
                slug += uid.rnd();
            }
            const newQuestion = new Question_model_1.default({
                title,
                description,
                slug,
                youtubeLink,
                leetcodeLink,
                articleLink,
                level,
                topicId: topic._id,
            });
            yield newQuestion.save();
            return res.status(201).json({
                title: newQuestion.title,
                description: newQuestion.description,
                slug: newQuestion.slug,
                youtubeLink: newQuestion.youtubeLink,
                leetcodeLink: newQuestion.leetcodeLink,
                articleLink: newQuestion.articleLink,
                level: newQuestion.level,
                completed: false,
                topic: {
                    title: topic.title,
                    slug: topic.slug,
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
    getAllQuestions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { searchValue, topicSlug, isCompleted, levels = [] } = req.query;
            const query = {};
            if (searchValue === null || searchValue === void 0 ? void 0 : searchValue.toString().trim()) {
                query.title = { $regex: searchValue, $options: "i" }; // Case-insensitive search
            }
            let topicId;
            if (topicSlug) {
                const topic = yield Topic_model_1.default.findOne({ slug: topicSlug });
                if (!topic) {
                    return res.status(404).json({ error: "No such topic found!" });
                }
                topicId = topic._id;
            }
            if (topicId) {
                query.topicId = topicId;
            }
            const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
            if (!user) {
                return res.status(401).json({ error: "No user found!" });
            }
            if (isCompleted !== undefined) {
                const completedQuestionIds = user.completedQuestions.map((q) => q.questionId.toString());
                // Filter completed or non-completed questions based on the query
                if (isCompleted === "true") {
                    query._id = { $in: completedQuestionIds }; // Only completed questions
                }
                else if (isCompleted === "false") {
                    query._id = { $nin: completedQuestionIds }; // Only non-completed questions
                }
            }
            if (Array.isArray(levels) && levels.length > 0) {
                query.level = { $in: levels }; // Only questions with the specified levels
            }
            const questionsQuery = Question_model_1.default.find(query, "title description slug topicId youtubeLink leetcodeLink articleLink level").populate("topicId", "title slug -_id");
            const questions = yield (0, pagination_1.paginate)(questionsQuery, req.pagination);
            let updatedData = JSON.parse(JSON.stringify(questions.data));
            if ((_a = user === null || user === void 0 ? void 0 : user.completedQuestions) === null || _a === void 0 ? void 0 : _a.length) {
                updatedData = questions.data.map((question) => {
                    for (let completedTopic of user === null || user === void 0 ? void 0 : user.completedQuestions) {
                        if (completedTopic.questionId.toString() === question._id.toString()) {
                            return Object.assign(Object.assign({}, question), { isCompleted: true });
                        }
                    }
                    return Object.assign(Object.assign({}, question), { isCompleted: false });
                });
            }
            else {
                updatedData = questions.data.map((question) => {
                    return Object.assign(Object.assign({}, question), { isCompleted: false });
                });
            }
            updatedData = updatedData.map((data) => {
                const obj = data._doc;
                obj["topic"] = obj.topicId;
                delete obj["topicId"];
                delete obj["_id"];
                return Object.assign({ completed: data.isCompleted }, obj);
            });
            return res.status(200).json(Object.assign(Object.assign({}, questions), { data: updatedData }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getQuestionById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const question = yield Question_model_1.default.findOne({ slug }).populate("topicId", "title slug -_id");
            if (!question) {
                return res.status(404).json({ error: "Question not found" });
            }
            return res.status(200).json(question);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    updateQuestion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const { title, description, level, youtubeLink, leetcodeLink, articleLink, topicSlug, completed, } = req.body;
            let topic;
            if (topicSlug) {
                topic = yield Topic_model_1.default.findOne({ slug: topicSlug });
            }
            const updatedQuestion = yield Question_model_1.default.findOneAndUpdate({ slug }, {
                $set: {
                    title,
                    description,
                    level,
                    youtubeLink,
                    leetcodeLink,
                    articleLink,
                    topicId: topic === null || topic === void 0 ? void 0 : topic._id,
                },
            }, { new: true, runValidators: true }).populate("topicId", "title slug -_id");
            if (!updatedQuestion) {
                return res.status(404).json({ error: "Question not found" });
            }
            const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
            if (!user) {
                return res.status(401).json({ error: "No user found!" });
            }
            const questionIndex = user.completedQuestions.findIndex((q) => q.questionId.toString() === updatedQuestion._id.toString());
            let isCompleted = questionIndex !== -1;
            if (completed !== undefined) {
                if (completed === false && isCompleted) {
                    // Remove the question if it's marked as not completed
                    user.completedQuestions.splice(questionIndex, 1);
                    isCompleted = false;
                }
                else if (completed === true && !isCompleted) {
                    // Add the question if it's marked as completed and doesn't already exist
                    user.completedQuestions.push({
                        questionId: updatedQuestion._id,
                        completedAt: new Date(), // Ensure completedAt is a valid date object
                    });
                    isCompleted = true;
                }
                // Save the updated user document
                yield user.save();
            }
            return res.status(200).json({
                title: updatedQuestion.title,
                slug: updatedQuestion.slug,
                description: updatedQuestion.description,
                level: updatedQuestion.level,
                youtubeLink: updatedQuestion.youtubeLink,
                leetcodeLink: updatedQuestion.leetcodeLink,
                articleLink: updatedQuestion.articleLink,
                topic: updatedQuestion.topicId,
                completed: isCompleted,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    deleteQuestion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const deletedQuestion = yield Question_model_1.default.findOneAndDelete({ slug });
            if (!deletedQuestion) {
                return res.status(404).json({ error: "Question not found" });
            }
            const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
            if (!user) {
                return res.status(401).json({ error: "No user found!" });
            }
            const questionIndex = user.completedQuestions.findIndex((q) => q.questionId.toString() === deletedQuestion._id.toString());
            if (questionIndex !== -1) {
                // Remove the question if it's marked as not completed
                user.completedQuestions.splice(questionIndex, 1);
            }
            // Save the updated user document
            yield user.save();
            return res.status(200).json({ message: "Question deleted successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = questionController;
//# sourceMappingURL=question.controllers.js.map