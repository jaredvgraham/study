import mongoose, { Schema, InferSchemaType, model, models } from "mongoose";

const ClassSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    accentColor: {
      type: String,
      trim: true,
    },
    quizContexts: [
      {
        quizId: {
          type: Schema.Types.ObjectId,
          ref: "Quiz",
          required: true,
        },
        title: {
          type: String,
          trim: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type ClassDocument = InferSchemaType<typeof ClassSchema>;

const ClassModel =
  (models.Class as mongoose.Model<ClassDocument>) ||
  model<ClassDocument>("Class", ClassSchema);

export type { ClassDocument };
export default ClassModel;
