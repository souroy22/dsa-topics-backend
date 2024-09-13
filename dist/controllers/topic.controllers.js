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
const User_model_1 = __importDefault(require("../models/User.model"));
const Topic_model_1 = __importDefault(require("../models/Topic.model"));
const pagination_1 = require("../utils/pagination");
const slugify_1 = __importDefault(require("slugify"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const getUserByEmail_1 = __importDefault(require("../utils/getUserByEmail"));
const topicControllers = {
    getTopics: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { isCompleted, searchValue } = req.query;
            const query = {};
            if (searchValue === null || searchValue === void 0 ? void 0 : searchValue.toString().trim()) {
                query.title = { $regex: searchValue, $options: "i" }; // Case-insensitive search
            }
            const userId = req.user.user.id;
            let user = null;
            // Filter topics by completion status if 'isCompleted' is provided
            user = yield User_model_1.default.findById(userId);
            if (isCompleted !== undefined) {
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const completedTopics = user.completedTopics.map((topic) => topic.topicId.toString());
                if (isCompleted === "true") {
                    query._id = { $in: completedTopics };
                }
                else {
                    query._id = { $nin: completedTopics };
                }
            }
            const findQuery = Topic_model_1.default.find(query);
            const topics = yield (0, pagination_1.paginate)(findQuery, req.pagination);
            let updatedData = JSON.parse(JSON.stringify(topics.data));
            if ((_a = user === null || user === void 0 ? void 0 : user.completedTopics) === null || _a === void 0 ? void 0 : _a.length) {
                updatedData = topics.data.map((topic) => {
                    for (let completedTopic of user === null || user === void 0 ? void 0 : user.completedTopics) {
                        if (completedTopic.topicId.toString() === topic._id.toString()) {
                            return {
                                title: topic.title,
                                slug: topic.slug,
                                isCompleted: true,
                            };
                        }
                    }
                    return { title: topic.title, slug: topic.slug, isCompleted: false };
                });
            }
            else {
                updatedData = topics.data.map((topic) => {
                    return { title: topic.title, slug: topic.slug, isCompleted: false };
                });
            }
            return res.status(200).json(Object.assign(Object.assign({}, topics), { data: updatedData }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    createTopic: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title } = req.body;
            let slug = (0, slugify_1.default)(title.slice(0, 15).trim(), { lower: true });
            const isExist = yield Topic_model_1.default.findOne({ slug });
            if (isExist) {
                const uid = new short_unique_id_1.default({ length: 6 });
                slug += uid.rnd();
            }
            const newTopic = new Topic_model_1.default({
                title,
                slug,
            });
            yield newTopic.save();
            return res.status(201).json({
                title: newTopic.title,
                slug: newTopic.slug,
                isCompleted: false,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    updateTopic: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, completed } = req.body;
            const { slug } = req.params;
            const updatedTopic = yield Topic_model_1.default.findOneAndUpdate({ slug }, { $set: { title } }, { new: true, runValidators: true });
            if (!updatedTopic) {
                return res.status(404).json({ message: "Topic not found" });
            }
            const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
            if (!user) {
                return res.status(401).json({ error: "No user found!" });
            }
            // Check if the topic is already completed by the user
            const topicIndex = user.completedTopics.findIndex((q) => q.topicId.toString() === updatedTopic._id.toString());
            let isCompleted = topicIndex !== -1;
            // Update completion status only if it's provided in the request
            if (completed !== undefined) {
                if (completed === false && isCompleted) {
                    // Remove the topic from completed if marked as not completed
                    user.completedTopics.splice(topicIndex, 1);
                    isCompleted = false;
                }
                else if (completed === true && !isCompleted) {
                    // Add the topic to completed if marked as completed
                    user.completedTopics.push({
                        topicId: updatedTopic._id,
                        completedAt: new Date(),
                    });
                    isCompleted = true;
                }
                // Save the updated user document
                yield user.save();
            }
            return res.status(200).json({
                title: updatedTopic.title,
                slug: updatedTopic.slug,
                isCompleted,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    deleteTopic: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const deletedTopic = yield Topic_model_1.default.findOneAndDelete({ slug });
            if (!deletedTopic) {
                return res.status(404).json({ message: "Topic not found" });
            }
            const user = yield (0, getUserByEmail_1.default)(req.user.user.email);
            if (!user) {
                return res.status(401).json({ error: "No user found!" });
            }
            const topicIndex = user.completedTopics.findIndex((q) => q.topicId.toString() === deletedTopic._id.toString());
            if (topicIndex !== -1) {
                user.completedQuestions.splice(topicIndex, 1);
            }
            // Save the updated user document
            yield user.save();
            return res.status(200).json({ message: "Topic deleted successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = topicControllers;
//# sourceMappingURL=topic.controllers.js.map