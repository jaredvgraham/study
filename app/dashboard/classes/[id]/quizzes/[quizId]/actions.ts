"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Types } from "mongoose";

import dbConnect from "@/backend/lib/db";
import QuizModel from "@/backend/models/Quiz";
import StudyGuide from "@/backend/models/StudyGuide";
import FlashcardSet from "@/backend/models/FlashcardSet";
import {
  generateFlashcards,
  generateStudyGuide,
} from "@/backend/services/chatgpt";

function ensureObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid identifier");
  }
  return new Types.ObjectId(id);
}

type ActionParams = {
  classId: string;
  quizId: string;
};

export async function generateStudyGuideAction({
  classId,
  quizId,
}: ActionParams) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!quizId || !classId) {
    throw new Error("Missing identifiers for study guide generation.");
  }

  await dbConnect();

  const quiz = await QuizModel.findOne({
    _id: ensureObjectId(quizId),
    ownerId: userId,
  }).lean();

  if (!quiz) {
    throw new Error("Quiz not found or access denied.");
  }

  const context = quiz.context?.provided ?? "";

  if (!context.trim()) {
    throw new Error("This quiz does not have saved context.");
  }

  const studyGuide = await generateStudyGuide({
    className: quiz.title,
    context,
  });

  await StudyGuide.findOneAndUpdate(
    { quizId, ownerId: userId },
    {
      quizId,
      ownerId: userId,
      title: studyGuide.title,
      summary: studyGuide.summary,
      sections: studyGuide.sections.map((section) => ({
        heading: section.heading,
        content: section.content,
        bulletPoints: section.bulletPoints ?? [],
      })),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  revalidatePath(`/dashboard/classes/${classId}/quizzes/${quizId}`);
}

export async function generateFlashcardsAction({
  classId,
  quizId,
}: ActionParams) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!quizId || !classId) {
    throw new Error("Missing identifiers for flashcard generation.");
  }

  await dbConnect();

  const quiz = await QuizModel.findOne({
    _id: ensureObjectId(quizId),
    ownerId: userId,
  }).lean();

  if (!quiz) {
    throw new Error("Quiz not found or access denied.");
  }

  const context = quiz.context?.provided ?? "";

  if (!context.trim()) {
    throw new Error("This quiz does not have saved context.");
  }

  const flashcardSet = await generateFlashcards({
    className: quiz.title,
    context,
  });

  await FlashcardSet.findOneAndUpdate(
    { quizId, ownerId: userId },
    {
      quizId,
      ownerId: userId,
      title: flashcardSet.title,
      cards: flashcardSet.cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        hint: card.hint ?? undefined,
      })),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  revalidatePath(`/dashboard/classes/${classId}/quizzes/${quizId}`);
}
