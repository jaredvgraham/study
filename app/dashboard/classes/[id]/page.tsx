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
    <div className="min-h-screen bg-(--color-app-background) px-4 py-12 text-(--color-app-text) sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-10 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-(--color-app-text-muted)">
                Class overview
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-(--color-app-text)">
                {classDoc.name}
              </h1>
              {classDoc.subject ? (
                <p className="mt-1 text-sm text-(--color-app-text-muted)">
                  {classDoc.subject}
                </p>
              ) : null}
            </div>
            {classDoc.accentColor ? (
              <span
                className="h-12 w-12 rounded-full border border-(--color-app-border) shadow-inner"
                style={{ backgroundColor: classDoc.accentColor }}
                aria-hidden="true"
              />
            ) : null}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-(--color-app-text)">
              Description
            </h2>
            <p className="text-sm leading-6 text-(--color-app-text-muted)">
              {classDoc.description
                ? classDoc.description
                : "No description provided yet."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-(--color-app-text-muted)">
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

        <section className="rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-10 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-(--color-app-text)">
                Study quizzes
              </h2>
              <p className="text-sm text-(--color-app-text-muted)">
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
            <div className="mt-8 rounded-2xl border border-dashed border-(--color-app-border) bg-(--color-app-surface-muted) p-8 text-center text-sm text-(--color-app-text-muted)">
              <p>
                No quizzes yet. Paste the specific lesson or notes you want to
                test and click
                <span className="font-semibold text-(--color-app-text)">
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
                <div className="space-y-4 rounded-2xl border border-(--color-app-border) bg-(--color-app-surface-muted) p-6 text-sm text-(--color-app-text)">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-(--color-app-text-muted)">
                    Saved quiz contexts
                  </h3>
                  <p className="text-xs text-(--color-app-text-muted)">
                    Each context stays linked to its quiz and the class so you
                    can build cumulative assessments later.
                  </p>
                  <ul className="space-y-3">
                    {storedQuizContexts.map((entry) => (
                      <li
                        key={`${entry.quizId}-${entry.createdAt ?? "context"}`}
                        className="rounded-xl border border-(--color-app-border) bg-(--color-app-surface) p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-(--color-app-text)">
                            {entry.title}
                          </p>
                          {entry.createdAt ? (
                            <span className="text-xs text-(--color-app-text-muted)">
                              Added {new Date(entry.createdAt).toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm text-(--color-app-text-muted)">
                          {entry.content}
                        </p>
                        {entry.quizId ? (
                          <div className="mt-3">
                            <Link
                              href={`/dashboard/classes/${classIdString}/quizzes/${entry.quizId}`}
                              className="text-xs font-semibold text-(--color-app-accent) transition hover:opacity-80"
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
