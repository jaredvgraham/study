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
      className="h-4 w-4 animate-spin rounded-full border-2 border-app-accent-foreground/40 border-t-app-accent-foreground"
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
      className="inline-flex items-center gap-2 rounded-full bg-(--color-app-accent) px-5 py-2 text-sm font-semibold text-(--color-app-accent-foreground) shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent) disabled:cursor-not-allowed disabled:opacity-60"
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
    <p className="text-xs text-(--color-app-text-muted)">
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
        className="block text-sm font-medium text-(--color-app-text)"
      >
        Quiz context *
      </label>
      <textarea
        id="quizContext"
        name="quizContext"
        required
        rows={4}
        placeholder="Paste or summarize the specific material this quiz should cover. For example: Chapters 3-4 on cellular respiration, lab results, vocabulary list, etc."
        className="w-full rounded-xl border border-(--color-app-border) bg-(--color-app-surface) px-4 py-3 text-sm text-(--color-app-text) shadow-sm outline-none transition focus:border-(--color-app-accent) focus:ring-2 focus:ring-app-accent/30 disabled:cursor-not-allowed"
        disabled={isDisabled}
        aria-disabled={isDisabled}
      />
      <p className="text-xs text-(--color-app-text-muted)">
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
            <p className="text-xs text-(--color-app-text-muted)">
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
