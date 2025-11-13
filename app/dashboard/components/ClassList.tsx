import ClassCard from "./ClassCard";

export type DashboardClass = {
  id: string;
  name: string;
  subject?: string;
  description?: string;
  accentColor?: string;
  createdAt?: string;
};

type ClassListProps = {
  classes: DashboardClass[];
};

export default function ClassList({ classes }: ClassListProps) {
  if (classes.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-10 py-16 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          You haven&apos;t created any classes yet
        </p>
        <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          Use the form on the left to create your first class. You can add more
          details and invite students once it&apos;s created.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Your classes">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Your classes
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Select a class to view lessons, assignments, and resources.
          </p>
        </div>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {classes.map((item) => (
          <ClassCard key={item.id} {...item} />
        ))}
      </ul>
    </section>
  );
}

