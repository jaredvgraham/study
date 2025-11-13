import mongoose, {
  Schema,
  InferSchemaType,
  model,
  models,
} from "mongoose";

const FlashcardSetSchema = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
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
    cards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        hint: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type FlashcardSetDocument = InferSchemaType<typeof FlashcardSetSchema>;

const FlashcardSet =
  (models.FlashcardSet as mongoose.Model<FlashcardSetDocument>) ||
  model<FlashcardSetDocument>("FlashcardSet", FlashcardSetSchema);

export type { FlashcardSetDocument };
export default FlashcardSet;

