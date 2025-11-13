import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import dbConnect from "@/backend/lib/db";
import { Types } from "mongoose";

import ClassModel, { ClassDocument } from "@/backend/models/Class";
import QuizModel from "@/backend/models/Quiz";
import { generateClassQuiz } from "./actions";
import QuizGeneratorForm from "./components/QuizGeneratorForm";
import QuizCard from "./components/QuizCard";

type ClassPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClassDetailPage({ params }: ClassPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();

  const { id } = await params;

  const classDoc = await ClassModel.findOne({
    _id: id,
    ownerId: userId,
  }).lean<ClassDocument & { _id: Types.ObjectId | string }>();

  if (!classDoc) {
    notFound();
  }

  const classIdString =
    typeof classDoc._id === "string"
      ? classDoc._id
      : classDoc._id?.toString() ?? id;

  const quizzes = await QuizModel.find({
    classId: classDoc._id,
    ownerId: userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const quizItems = quizzes.map((quiz) => ({
    id: quiz._id.toString(),
    title: quiz.title,
    questionCount: quiz.questionCount,
    createdAt: quiz.createdAt?.toISOString(),
  }));
  const storedQuizContexts =
    classDoc.quizContexts?.map((contextEntry) => ({
      quizId:
        typeof contextEntry.quizId === "string"
          ? contextEntry.quizId
          : contextEntry.quizId?.toString() ?? "",
      title: contextEntry.title ?? "Quiz context",
      content: contextEntry.content,
      createdAt: contextEntry.createdAt
        ? new Date(contextEntry.createdAt).toISOString()
        : undefined,
    })) ?? [];
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Class overview
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                {classDoc.name}
              </h1>
              {classDoc.subject ? (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {classDoc.subject}
                </p>
              ) : null}
            </div>
            {classDoc.accentColor ? (
              <span
                className="h-12 w-12 rounded-full border border-zinc-200 shadow-inner dark:border-zinc-800"
                style={{ backgroundColor: classDoc.accentColor }}
                aria-hidden="true"
              />
            ) : null}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Description
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {classDoc.description
                ? classDoc.description
                : "No description provided yet."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span>
              Created{" "}
              {classDoc.createdAt
                ? new Date(classDoc.createdAt).toLocaleString()
                : "recently"}
            </span>
            <span>
              Updated{" "}
              {classDoc.updatedAt
                ? new Date(classDoc.updatedAt).toLocaleString()
                : "recently"}
            </span>
          </div>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Study quizzes
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Generate focused quizzes by pasting the exact material you want
                to assess. We&apos;ll archive each quiz context so you can build
                cumulative exams later.
              </p>
            </div>
            <QuizGeneratorForm
              classId={classIdString}
              action={generateClassQuiz}
            />
          </div>

          {quizItems.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              <p>
                No quizzes yet. Paste the specific lesson or notes you want to
                test and click
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {" "}
                  Generate quiz
                </span>{" "}
                to create your first one.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <ul className="grid gap-5 md:grid-cols-2">
                {quizItems.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    id={quiz.id}
                    classId={classIdString}
                    title={quiz.title}
                    questionCount={quiz.questionCount}
                    createdAt={quiz.createdAt}
                  />
                ))}
              </ul>
              {storedQuizContexts.length > 0 ? (
                <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Saved quiz contexts
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Each context stays linked to its quiz and the class so you
                    can build cumulative assessments later.
                  </p>
                  <ul className="space-y-3">
                    {storedQuizContexts.map((entry) => (
                      <li
                        key={`${entry.quizId}-${entry.createdAt ?? "context"}`}
                        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {entry.title}
                          </p>
                          {entry.createdAt ? (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              Added {new Date(entry.createdAt).toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-200">
                          {entry.content}
                        </p>
                        {entry.quizId ? (
                          <div className="mt-3">
                            <Link
                              href={`/dashboard/classes/${classIdString}/quizzes/${entry.quizId}`}
                              className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                              Open quiz →
                            </Link>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
