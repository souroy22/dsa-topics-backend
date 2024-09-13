import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export type USER_ROLE_TYPE = "ADMIN" | "USER";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone: number;
  role: USER_ROLE_TYPE;
  email: string;
  password: string;
  avatar: string | null;
  completedTopics: { topicId: ObjectId; completedAt: Date }[];
  completedQuestions: { questionId: ObjectId; completedAt: Date }[];
}

const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: {
    type: Number,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please fill a valid phone number"],
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    index: true,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  avatar: { type: String, default: null },
  completedTopics: {
    type: [
      {
        topicId: { type: Types.ObjectId, ref: "Topic" },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  completedQuestions: {
    type: [
      {
        questionId: { type: Types.ObjectId, ref: "Question" },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

// hash password before save
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
