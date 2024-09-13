import mongoose, { Document, Schema } from "mongoose";

export interface ITopic extends Document {
  title: string;
  slug: string;
}

const TopicSchema: Schema<ITopic> = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true },
});

const Topic = mongoose.model<ITopic>("Topic", TopicSchema);
export default Topic;
