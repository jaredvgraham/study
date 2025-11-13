"use client";

import { useFormStatus } from "react-dom";

type FormAction = (formData: FormData) => void | Promise<void>;

type QuizGeneratorFormProps = {
  classId: string;
  action: FormAction;
  disabled?: boolean;
  disabledReason?: string;
};

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-emerald-900/50 dark:border-t-emerald-900"
      aria-hidden="true"
    />
  );
}

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
      disabled={isDisabled}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <Spinner />
          Generating…
        </>
      ) : (
        "Generate quiz"
      )}
    </button>
  );
}

function StatusHint() {
  const { pending } = useFormStatus();

  if (!pending) {
    return null;
  }

  return (
    <p className="text-xs text-emerald-700 dark:text-emerald-300">
      Crafting fresh questions. This usually takes a few seconds.
    </p>
  );
}

function QuizContextField({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor="quizContext"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Quiz context *
      </label>
      <textarea
        id="quizContext"
        name="quizContext"
        required
        rows={4}
        placeholder="Paste or summarize the specific material this quiz should cover. For example: Chapters 3-4 on cellular respiration, lab results, vocabulary list, etc."
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        disabled={isDisabled}
        aria-disabled={isDisabled}
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        We&apos;ll attach this to the class for future reference and reuse it
        when generating comprehensive exams.
      </p>
    </div>
  );
}

export default function QuizGeneratorForm({
  classId,
  action,
  disabled,
  disabledReason,
}: QuizGeneratorFormProps) {
  return (
    <form
      action={action}
      className="flex w-full flex-col gap-4 md:max-w-xl"
      aria-live="polite"
    >
      <input type="hidden" name="classId" value={classId} />
      <QuizContextField disabled={disabled} />
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <SubmitButton disabled={disabled} />
        {disabled ? (
          disabledReason ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {disabledReason}
            </p>
          ) : null
        ) : (
          <StatusHint />
        )}
      </div>
    </form>
  );
}
