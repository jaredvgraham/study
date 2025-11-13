import { createClass } from "@/app/dashboard/actions";
import NewClassFormClient from "./NewClassFormClient";

const accentOptions = [
  "#2563eb",
  "#7c3aed",
  "#dc2626",
  "#16a34a",
  "#f59e0b",
];

export default function NewClassForm() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Create a new class
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Organize your lessons by creating a class. You can add details now or
        update them later.
      </p>
      <NewClassFormClient accentOptions={accentOptions} action={createClass} />
    </section>
  );
}

