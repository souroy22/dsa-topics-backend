import { Request, Response } from "express";
import Question, { IQuestion } from "../models/Question.model";
import { HydratedDocument, ObjectId } from "mongoose";
import Topic, { ITopic } from "../models/Topic.model";
import { paginate } from "../utils/pagination";
import slugify from "slugify";
import ShortUniqueId from "short-unique-id";
import getUserData from "../utils/getUserByEmail";

const questionController = {
  createQuestion: async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        youtubeLink,
        leetcodeLink,
        articleLink,
        level,
        topicSlug,
      } = req.body;
      const topic: ITopic = await Topic.findOne({ slug: topicSlug });
      if (!topic) {
        return res.status(404).json({ error: "Topic not found!" });
      }
      let slug = slugify(title.slice(0, 15).trim(), { lower: true });
      const isExist = await Question.findOne({ slug });
      if (isExist) {
        const uid = new ShortUniqueId({ length: 6 });
        slug += uid.rnd();
      }
      const newQuestion: HydratedDocument<IQuestion> = new Question({
        title,
        description,
        slug,
        youtubeLink,
        leetcodeLink,
        articleLink,
        level,
        topicId: topic._id,
      });
      await newQuestion.save();
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getAllQuestions: async (req: Request, res: Response) => {
    try {
      const { searchValue, topicSlug, isCompleted, levels = [] } = req.query;
      const query: any = {};
      if (searchValue?.toString().trim()) {
        query.title = { $regex: searchValue, $options: "i" }; // Case-insensitive search
      }
      let topicId;
      if (topicSlug) {
        const topic = await Topic.findOne({ slug: topicSlug });
        if (!topic) {
          return res.status(404).json({ error: "No such topic found!" });
        }
        topicId = topic._id;
      }
      if (topicId) {
        query.topicId = topicId;
      }
      const user = await getUserData(req.user.user.email);
      if (!user) {
        return res.status(401).json({ error: "No user found!" });
      }
      if (isCompleted !== undefined) {
        const completedQuestionIds = user.completedQuestions.map((q: any) =>
          q.questionId.toString()
        );

        // Filter completed or non-completed questions based on the query
        if (isCompleted === "true") {
          query._id = { $in: completedQuestionIds }; // Only completed questions
        } else if (isCompleted === "false") {
          query._id = { $nin: completedQuestionIds }; // Only non-completed questions
        }
      }
      if (Array.isArray(levels) && levels.length > 0) {
        query.level = { $in: levels }; // Only questions with the specified levels
      }
      const questionsQuery = Question.find(
        query,
        "title description slug topicId youtubeLink leetcodeLink articleLink level"
      ).populate("topicId", "title slug -_id");
      const questions = await paginate(questionsQuery, req.pagination);
      let updatedData: any = JSON.parse(JSON.stringify(questions.data));
      if (user?.completedQuestions?.length) {
        updatedData = questions.data.map((question: any) => {
          for (let completedTopic of user?.completedQuestions) {
            if (
              completedTopic.questionId.toString() === question._id.toString()
            ) {
              return {
                ...question,
                isCompleted: true,
              };
            }
          }
          return { ...question, isCompleted: false };
        });
      } else {
        updatedData = questions.data.map((question: any) => {
          return { ...question, isCompleted: false };
        });
      }
      updatedData = updatedData.map((data: any) => {
        const obj = data._doc;
        obj["topic"] = obj.topicId;
        delete obj["topicId"];
        delete obj["_id"];
        return { completed: data.isCompleted, ...obj };
      });
      return res.status(200).json({ ...questions, data: updatedData });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getQuestionById: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const question = await Question.findOne({ slug }).populate(
        "topicId",
        "title slug -_id"
      );
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.status(200).json(question);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  updateQuestion: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const {
        title,
        description,
        level,
        youtubeLink,
        leetcodeLink,
        articleLink,
        topicSlug,
        completed,
      } = req.body;
      let topic;
      if (topicSlug) {
        topic = await Topic.findOne({ slug: topicSlug });
      }

      const updatedQuestion: IQuestion = await Question.findOneAndUpdate(
        { slug },
        {
          $set: {
            title,
            description,
            level,
            youtubeLink,
            leetcodeLink,
            articleLink,
            topicId: topic?._id,
          },
        },
        { new: true, runValidators: true }
      ).populate("topicId", "title slug -_id");

      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      const user = await getUserData(req.user.user.email);
      if (!user) {
        return res.status(401).json({ error: "No user found!" });
      }
      const questionIndex = user.completedQuestions.findIndex(
        (q) => q.questionId.toString() === updatedQuestion._id.toString()
      );
      let isCompleted = questionIndex !== -1;
      if (completed !== undefined) {
        if (completed === false && isCompleted) {
          // Remove the question if it's marked as not completed
          user.completedQuestions.splice(questionIndex, 1);
          isCompleted = false;
        } else if (completed === true && !isCompleted) {
          // Add the question if it's marked as completed and doesn't already exist
          user.completedQuestions.push({
            questionId: updatedQuestion._id as ObjectId,
            completedAt: new Date(), // Ensure completedAt is a valid date object
          });
          isCompleted = true;
        }
        // Save the updated user document
        await user.save();
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  deleteQuestion: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const deletedQuestion = await Question.findOneAndDelete({ slug });
      if (!deletedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
      const user = await getUserData(req.user.user.email);
      if (!user) {
        return res.status(401).json({ error: "No user found!" });
      }
      const questionIndex = user.completedQuestions.findIndex(
        (q) => q.questionId.toString() === deletedQuestion._id.toString()
      );

      if (questionIndex !== -1) {
        // Remove the question if it's marked as not completed
        user.completedQuestions.splice(questionIndex, 1);
      }

      // Save the updated user document
      await user.save();
      return res.status(200).json({ msg: "Question deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default questionController;
