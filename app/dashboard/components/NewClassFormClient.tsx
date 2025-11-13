"use client";

import { useFormStatus } from "react-dom";

type FormAction = (formData: FormData) => void | Promise<void>;

type NewClassFormClientProps = {
  accentOptions: string[];
  action: FormAction;
};

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <Spinner />
          Creating…
        </>
      ) : (
        "Create class"
      )}
    </button>
  );
}

function FormFields({ accentOptions }: { accentOptions: string[] }) {
  const { pending } = useFormStatus();

  return (
    <fieldset className="space-y-5" disabled={pending} aria-disabled={pending}>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Class name *
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Algebra II"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            placeholder="Mathematics"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Accent color
          </span>
          <div className="flex items-center gap-3">
            {accentOptions.map((color) => (
              <label key={color} className="relative">
                <input
                  type="radio"
                  name="accentColor"
                  value={color}
                  className="peer sr-only"
                />
                <span
                  className="block h-8 w-8 rounded-full border-2 border-transparent transition peer-checked:border-zinc-900 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-500"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Weekly lessons, homework, and resources."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>
    </fieldset>
  );
}

export default function NewClassFormClient({
  accentOptions,
  action,
}: NewClassFormClientProps) {
  return (
    <form action={action} className="mt-6 space-y-5" aria-live="polite">
      <FormFields accentOptions={accentOptions} />
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

