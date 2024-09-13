import { Request, Response } from "express";
import User from "../models/User.model";
import Topic, { ITopic } from "../models/Topic.model";
import { paginate } from "../utils/pagination";
import slugify from "slugify";
import ShortUniqueId from "short-unique-id";
import { HydratedDocument, ObjectId } from "mongoose";
import getUserData from "../utils/getUserByEmail";

const topicControllers = {
  getTopics: async (req: Request, res: Response) => {
    try {
      const { isCompleted, searchValue } = req.query;
      const query: any = {};
      if (searchValue?.toString().trim()) {
        query.title = { $regex: searchValue, $options: "i" }; // Case-insensitive search
      }
      const userId = req.user.user.id;
      let user = null;
      // Filter topics by completion status if 'isCompleted' is provided
      user = await User.findById(userId);
      if (isCompleted !== undefined) {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const completedTopics = user.completedTopics.map((topic) =>
          topic.topicId.toString()
        );
        if (isCompleted === "true") {
          query._id = { $in: completedTopics };
        } else {
          query._id = { $nin: completedTopics };
        }
      }

      const findQuery = Topic.find(query);
      const topics: any = await paginate(findQuery, req.pagination);
      let updatedData: any = JSON.parse(JSON.stringify(topics.data));
      if (user?.completedTopics?.length) {
        updatedData = topics.data.map((topic: any) => {
          for (let completedTopic of user?.completedTopics) {
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
      } else {
        updatedData = topics.data.map((topic: any) => {
          return { title: topic.title, slug: topic.slug, isCompleted: false };
        });
      }
      return res.status(200).json({ ...topics, data: updatedData });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  createTopic: async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      let slug = slugify(title.slice(0, 15).trim(), { lower: true });
      const isExist = await Topic.findOne({ slug });
      if (isExist) {
        const uid = new ShortUniqueId({ length: 6 });
        slug += uid.rnd();
      }
      const newTopic: HydratedDocument<ITopic> = new Topic({
        title,
        slug,
      });
      await newTopic.save();
      return res.status(201).json({
        title: newTopic.title,
        slug: newTopic.slug,
        isCompleted: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  updateTopic: async (req: Request, res: Response) => {
    try {
      const { title, completed } = req.body;
      const { slug } = req.params;
      const updatedTopic = await Topic.findOneAndUpdate(
        { slug },
        { $set: { title } },
        { new: true, runValidators: true }
      );
      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      const user = await getUserData(req.user.user.email);
      if (!user) {
        return res.status(401).json({ error: "No user found!" });
      }

      // Check if the topic is already completed by the user
      const topicIndex = user.completedTopics.findIndex(
        (q) => q.topicId.toString() === updatedTopic._id.toString()
      );
      let isCompleted = topicIndex !== -1;

      // Update completion status only if it's provided in the request
      if (completed !== undefined) {
        if (completed === false && isCompleted) {
          // Remove the topic from completed if marked as not completed
          user.completedTopics.splice(topicIndex, 1);
          isCompleted = false;
        } else if (completed === true && !isCompleted) {
          // Add the topic to completed if marked as completed
          user.completedTopics.push({
            topicId: updatedTopic._id as ObjectId,
            completedAt: new Date(),
          });
          isCompleted = true;
        }

        // Save the updated user document
        await user.save();
      }
      return res.status(200).json({
        title: updatedTopic.title,
        slug: updatedTopic.slug,
        isCompleted,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  deleteTopic: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const deletedTopic = await Topic.findOneAndDelete({ slug });
      if (!deletedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      const user = await getUserData(req.user.user.email);
      if (!user) {
        return res.status(401).json({ error: "No user found!" });
      }
      const topicIndex = user.completedTopics.findIndex(
        (q) => q.topicId.toString() === deletedTopic._id.toString()
      );

      if (topicIndex !== -1) {
        user.completedQuestions.splice(topicIndex, 1);
      }

      // Save the updated user document
      await user.save();
      return res.status(200).json({ message: "Topic deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default topicControllers;
