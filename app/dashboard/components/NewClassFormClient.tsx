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
      className="inline-flex items-center gap-2 rounded-full bg-(--color-app-accent) px-5 py-2 text-sm font-semibold text-(--color-app-accent-foreground) shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent) disabled:cursor-not-allowed disabled:opacity-70"
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
          className="block text-sm font-medium text-(--color-app-text)"
        >
          Class name *
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Algebra II"
          className="w-full rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 py-2 text-sm text-(--color-app-text) shadow-sm outline-none transition focus:border-(--color-app-accent) focus:ring-2 focus:ring-app-accent/30 disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-(--color-app-text)"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            placeholder="Mathematics"
            className="w-full rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 py-2 text-sm text-(--color-app-text) shadow-sm outline-none transition focus:border-(--color-app-accent) focus:ring-2 focus:ring-app-accent/30 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-(--color-app-text)">
            Accent color
          </span>
          <div className="flex items-center gap-3">
            {accentOptions.map((color) => (
              <label
                key={color}
                className="accent-option"
              >
                <input
                  type="radio"
                  name="accentColor"
                  value={color}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: color }}
                  className="accent-swatch"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-(--color-app-text)"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Weekly lessons, homework, and resources."
          className="w-full rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 py-2 text-sm text-(--color-app-text) shadow-sm outline-none transition focus:border-(--color-app-accent) focus:ring-2 focus:ring-app-accent/30 disabled:cursor-not-allowed"
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

