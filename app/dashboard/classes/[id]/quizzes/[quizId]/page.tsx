import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import Link from "next/link";

import dbConnect from "@/backend/lib/db";
import ClassModel from "@/backend/models/Class";
import QuizModel from "@/backend/models/Quiz";

import QuizRunner from "./QuizRunner";

type QuizDetailPageProps = {
  params: Promise<{
    id: string;
    quizId: string;
  }>;
};

export default async function QuizDetailPage({
  params,
}: QuizDetailPageProps) {
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
  })
    .lean();

  if (!quizDoc) {
    notFound();
  }

  const quizIdString =
    typeof quizDoc._id === "string"
      ? quizDoc._id
      : quizDoc._id.toString();

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/dashboard"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Dashboard
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/dashboard/classes/${classDoc._id.toString()}`}
            className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {classDoc.name}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">
            Quiz
          </span>
        </nav>

        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Quiz #{quizIdString.slice(-6)}
              </p>
              <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                {quizDoc.title}
              </h1>
              {classDoc.subject ? (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {classDoc.subject}
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              <p>
                {quizDoc.questionCount}{" "}
                {quizDoc.questionCount === 1 ? "question" : "questions"}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Generated{" "}
                {quizDoc.createdAt
                  ? new Date(quizDoc.createdAt).toLocaleString()
                  : "recently"}
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Quiz context
          </h2>
          <p className="mt-3 whitespace-pre-line rounded-2xl bg-zinc-100/70 p-4 text-sm leading-6 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100">
            {quizDoc.context?.provided}
          </p>
        </section>

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

