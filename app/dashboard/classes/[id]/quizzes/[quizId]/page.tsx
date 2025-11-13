import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import Link from "next/link";

import dbConnect from "@/backend/lib/db";
import ClassModel from "@/backend/models/Class";
import QuizModel from "@/backend/models/Quiz";
import StudyGuide from "@/backend/models/StudyGuide";
import FlashcardSet from "@/backend/models/FlashcardSet";
import QuizRunner from "./QuizRunner";
import StudyGuidePanel from "./components/StudyGuidePanel";
import FlashcardPanel from "./components/FlashcardPanel";

type QuizDetailPageProps = {
  params: Promise<{
    id: string;
    quizId: string;
  }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();

  const { id: classId, quizId } = await params;

  const classDoc = await ClassModel.findOne({
    _id: classId,
    ownerId: userId,
  })
    .select("_id name subject")
    .lean();

  if (!classDoc) {
    notFound();
  }

  const quizDoc = await QuizModel.findOne({
    _id: quizId,
    classId: new Types.ObjectId(classDoc._id),
    ownerId: userId,
  }).lean();

  if (!quizDoc) {
    notFound();
  }

  const quizIdString =
    typeof quizDoc._id === "string" ? quizDoc._id : quizDoc._id.toString();

  const quizContext = quizDoc.context?.provided ?? "";

  const [studyGuide, flashcardSet] = await Promise.all([
    StudyGuide.findOne({
      quizId: new Types.ObjectId(quizIdString),
      ownerId: userId,
    }).lean(),
    FlashcardSet.findOne({
      quizId: new Types.ObjectId(quizIdString),
      ownerId: userId,
    }).lean(),
  ]);
  const hasQuizContext = quizContext.trim().length > 0;
  const studyGuideData = studyGuide
    ? {
        title: studyGuide.title,
        summary: studyGuide.summary,
        sections:
          studyGuide.sections?.map((section) => ({
            heading: section.heading,
            content: section.content,
            bulletPoints: section.bulletPoints ?? [],
          })) ?? [],
      }
    : null;
  const flashcardSetData = flashcardSet
    ? {
        title: flashcardSet.title,
        cards:
          flashcardSet.cards?.map((card) => ({
            question: card.question,
            answer: card.answer,
            hint: card.hint ?? undefined,
          })) ?? [],
      }
    : null;

  return (
    <div className="min-h-screen bg-(--color-app-background) px-4 py-12 text-(--color-app-text) sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <nav className="flex items-center gap-2 text-sm text-(--color-app-text-muted)">
          <Link
            href="/dashboard"
            className="transition hover:text-(--color-app-text)"
          >
            Dashboard
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/dashboard/classes/${classDoc._id.toString()}`}
            className="transition hover:text-(--color-app-text)"
          >
            {classDoc.name}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-(--color-app-text)">Quiz</span>
        </nav>

        <header className="rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-(--color-app-text-muted)">
                Quiz #{quizIdString.slice(-6)}
              </p>
              <h1 className="text-3xl font-semibold text-(--color-app-text)">
                {quizDoc.title}
              </h1>
              {classDoc.subject ? (
                <p className="mt-1 text-sm text-(--color-app-text-muted)">
                  {classDoc.subject}
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-(--color-app-border) bg-(--color-app-surface-muted) px-4 py-3 text-sm text-(--color-app-text-muted)">
              <p>
                {quizDoc.questionCount}{" "}
                {quizDoc.questionCount === 1 ? "question" : "questions"}
              </p>
              <p className="text-xs text-(--color-app-text-muted)">
                Generated{" "}
                {quizDoc.createdAt
                  ? new Date(quizDoc.createdAt).toLocaleString()
                  : "recently"}
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-app-text-muted)">
            Quiz context
          </h2>
          {hasQuizContext ? (
            <p className="mt-3 whitespace-pre-line rounded-2xl bg-(--color-app-surface-muted) p-4 text-sm leading-6 text-(--color-app-text)">
              {quizContext}
            </p>
          ) : (
            <p className="mt-3 text-sm text-(--color-app-text-muted)">
              No context is stored for this quiz. Generate or regenerate the
              quiz with the relevant material to unlock study tools.
            </p>
          )}
        </section>

        <StudyGuidePanel
          classId={classDoc._id.toString()}
          quizId={quizIdString}
          studyGuide={studyGuideData}
        />

        <FlashcardPanel
          classId={classDoc._id.toString()}
          quizId={quizIdString}
          flashcardSet={flashcardSetData}
        />

        <QuizRunner
          questions={quizDoc.questions.map((question) => ({
            prompt: question.prompt,
            options: question.options,
            answer: question.answer,
            explanation: question.explanation ?? undefined,
          }))}
        />
      </div>
    </div>
  );
}
