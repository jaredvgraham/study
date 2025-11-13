import Link from "next/link";

type QuizCardProps = {
  id: string;
  classId: string;
  title: string;
  questionCount: number;
  createdAt?: string;
};

export default function QuizCard({
  id,
  classId,
  title,
  questionCount,
  createdAt,
}: QuizCardProps) {
  return (
    <li>
      <Link
        href={`/dashboard/classes/${classId}/quizzes/${id}`}
        className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 transition group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
              {title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {questionCount} {questionCount === 1 ? "question" : "questions"}
            </p>
          </div>
          <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
            Quiz
          </span>
        </div>

        <p className="mt-auto pt-6 text-xs text-zinc-500 dark:text-zinc-400">
          Generated{" "}
          {createdAt ? new Date(createdAt).toLocaleString() : "just now"}
        </p>
      </Link>
    </li>
  );
}

