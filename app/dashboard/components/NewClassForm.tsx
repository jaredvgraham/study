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
    <section className="rounded-2xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-(--color-app-text)">
        Create a new class
      </h2>
      <p className="mt-1 text-sm text-(--color-app-text-muted)">
        Organize your lessons by creating a class. You can add details now or
        update them later.
      </p>
      <NewClassFormClient accentOptions={accentOptions} action={createClass} />
    </section>
  );
}

