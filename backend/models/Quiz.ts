import mongoose, {
  Schema,
  InferSchemaType,
  model,
  models,
} from "mongoose";

const QuizSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questionCount: {
      type: Number,
      required: true,
      min: 1,
    },
    questions: [
      {
        prompt: { type: String, required: true },
        options: [{ type: String, required: true }],
        answer: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    context: {
      provided: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type QuizDocument = InferSchemaType<typeof QuizSchema>;

const QuizModel =
  (models.Quiz as mongoose.Model<QuizDocument>) ||
  model<QuizDocument>("Quiz", QuizSchema);

export type { QuizDocument };
export default QuizModel;

