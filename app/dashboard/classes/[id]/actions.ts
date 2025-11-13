"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import dbConnect from "@/backend/lib/db";
import ClassModel from "@/backend/models/Class";
import QuizModel from "@/backend/models/Quiz";
import { generateQuiz } from "@/backend/services/chatgpt";

export async function generateClassQuiz(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const classId = String(formData.get("classId") ?? "");
  const providedContext = String(formData.get("quizContext") ?? "").trim();

  if (!classId) {
    throw new Error("Missing class identifier");
  }

  if (!providedContext) {
    throw new Error("Please provide context for this quiz.");
  }

  await dbConnect();

  const classDoc = await ClassModel.findOne({
    _id: classId,
    ownerId: userId,
  }).lean();

  if (!classDoc) {
    throw new Error("Class not found or access denied.");
  }

  const quiz = await generateQuiz({
    className: classDoc.name,
    context: providedContext,
  });

  const newQuiz = await QuizModel.create({
    classId,
    ownerId: userId,
    title: quiz.title,
    questionCount: quiz.questions.length,
    questions: quiz.questions,
    context: {
      provided: providedContext,
    },
  });

  await ClassModel.updateOne(
    { _id: classId, ownerId: userId },
    {
      $push: {
        quizContexts: {
          quizId: newQuiz._id,
          title: newQuiz.title,
          content: providedContext,
          createdAt: new Date(),
        },
      },
    }
  );

  revalidatePath(`/dashboard/classes/${classId}`);
  revalidatePath(`/dashboard/classes/${classId}/quizzes`);
  revalidatePath(
    `/dashboard/classes/${classId}/quizzes/${newQuiz._id.toString()}`
  );
}
