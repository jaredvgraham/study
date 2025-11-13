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
        className="group flex h-full flex-col rounded-2xl border border-(--color-app-border) bg-(--color-app-surface) p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent)"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-(--color-app-text) transition group-hover:text-(--color-app-accent)">
              {name}
            </h3>
            {subject ? (
              <p className="mt-1 text-sm text-(--color-app-text-muted)">
                {subject}
              </p>
            ) : null}
          </div>
          {accentColor ? (
            <span
              className="h-8 w-8 rounded-full border border-(--color-app-border)"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
          ) : null}
        </div>

        {description ? (
          <p className="mt-4 line-clamp-3 text-sm text-(--color-app-text-muted)">
            {description}
          </p>
        ) : (
          <p className="mt-4 text-sm text-(--color-app-text-muted)">
            Add a description to help your students understand the focus of this
            class.
          </p>
        )}

        <div className="mt-auto pt-4 text-xs font-medium uppercase tracking-wide text-(--color-app-text-muted)">
          {createdAt
            ? new Date(createdAt).toLocaleDateString()
            : "Recently added"}
        </div>
      </Link>
    </li>
  );
}

