import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export type LEVEL_TYPE = "EASY" | "MEDIUM" | "HARD";

export interface IQuestion extends Document {
  title: string;
  description: string;
  slug: string;
  youtubeLink: string | null;
  leetcodeLink: string | null;
  articleLink: string | null;
  level: LEVEL_TYPE;
  topicId: ObjectId;
}

const QuestionSchema: Schema<IQuestion> = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  level: { type: String, enum: ["EASY", "MEDIUM", "HARD"], default: "EASY" },
  slug: { type: String, required: true, unique: true },
  youtubeLink: { type: String, default: null },
  leetcodeLink: { type: String, default: null },
  articleLink: { type: String, default: null },
  topicId: { type: Types.ObjectId, ref: "Topic", required: true },
});

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
