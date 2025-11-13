import Link from "next/link";

type ClassCardProps = {
  id: string;
  name: string;
  subject?: string;
  description?: string;
  accentColor?: string;
  createdAt?: string;
};

export default function ClassCard({
  id,
  name,
  subject,
  description,
  accentColor,
  createdAt,
}: ClassCardProps) {
  return (
    <li>
      <Link
        href={`/dashboard/classes/${id}`}
        className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 transition group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
              {name}
            </h3>
            {subject ? (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {subject}
              </p>
            ) : null}
          </div>
          {accentColor ? (
            <span
              className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
          ) : null}
        </div>

        {description ? (
          <p className="mt-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        ) : (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Add a description to help your students understand the focus of this
            class.
          </p>
        )}

        <div className="mt-auto pt-4 text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {createdAt
            ? new Date(createdAt).toLocaleDateString()
            : "Recently added"}
        </div>
      </Link>
    </li>
  );
}

