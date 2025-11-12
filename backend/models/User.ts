import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type UserDocument = InferSchemaType<typeof UserSchema>;

const User =
  (models.User as mongoose.Model<UserDocument>) ||
  model<UserDocument>("User", UserSchema);

export type { UserDocument };
export default User;
