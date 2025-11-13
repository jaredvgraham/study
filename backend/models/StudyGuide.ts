import mongoose, {
  Schema,
  InferSchemaType,
  model,
  models,
} from "mongoose";

const StudyGuideSchema = new Schema(
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
    summary: {
      type: String,
      required: true,
    },
    sections: [
      {
        heading: { type: String, required: true },
        content: { type: String, required: true },
        bulletPoints: [{ type: String }],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type StudyGuideDocument = InferSchemaType<typeof StudyGuideSchema>;

const StudyGuide =
  (models.StudyGuide as mongoose.Model<StudyGuideDocument>) ||
  model<StudyGuideDocument>("StudyGuide", StudyGuideSchema);

export type { StudyGuideDocument };
export default StudyGuide;

