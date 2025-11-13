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
        className="group flex h-full flex-col rounded-2xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent)"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-(--color-app-text) transition group-hover:text-(--color-app-accent)">
              {title}
            </h3>
            <p className="mt-1 text-sm text-(--color-app-text-muted)">
              {questionCount} {questionCount === 1 ? "question" : "questions"}
            </p>
          </div>
          <span className="rounded-full border border-emerald-400/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600 dark:border-emerald-400/50 dark:text-emerald-300">
            Quiz
          </span>
        </div>

        <p className="mt-auto pt-6 text-xs text-(--color-app-text-muted)">
          Generated{" "}
          {createdAt ? new Date(createdAt).toLocaleString() : "just now"}
        </p>
      </Link>
    </li>
  );
}

