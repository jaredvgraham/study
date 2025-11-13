"use client";

import { useMemo, useState } from "react";

type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string;
};

type QuizRunnerProps = {
  questions: QuizQuestion[];
};

type AnswerState = {
  selected?: string;
  isCorrect?: boolean;
  checked?: boolean;
};

export default function QuizRunner({ questions }: QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [checkAsYouGo, setCheckAsYouGo] = useState(false);

  const { interimScore, answeredCount, finalScore } = useMemo(() => {
    let correct = 0;
    let checkedCount = 0;

    questions.forEach((question, index) => {
      const entry = answers[index];
      if (entry?.checked) {
        checkedCount += 1;
        if (entry.isCorrect) {
          correct += 1;
        }
      }
    });

    const final = submitted ? correct : 0;

    return {
      interimScore: correct,
      answeredCount: checkedCount,
      finalScore: final,
    };
  }, [answers, questions, submitted]);

  const handleSelect = (questionIndex: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        selected: option,
        ...(checkAsYouGo
          ? {
              isCorrect: option === questions[questionIndex].answer,
              checked: true,
            }
          : {}),
      },
    }));
  };

  const handleSubmit = () => {
    if (submitted) {
      return;
    }

    const evaluated: Record<number, AnswerState> = {};
    questions.forEach((question, index) => {
      const selection = answers[index]?.selected;
      evaluated[index] = {
        selected: selection,
        isCorrect: selection === question.answer,
        checked: true,
      };
    });

    setAnswers(evaluated);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const toggleCheckMode = () => {
    if (submitted) {
      return;
    }
    setCheckAsYouGo((prevMode) => {
      const nextMode = !prevMode;

      setAnswers((prevAnswers) => {
        const nextAnswers: Record<number, AnswerState> = {};

        Object.keys(prevAnswers).forEach((key) => {
          const index = Number(key);
          const prevState = prevAnswers[index];
          if (!prevState) {
            return;
          }

          if (nextMode) {
            if (prevState.selected === undefined) {
              nextAnswers[index] = {
                selected: prevState.selected,
              };
            } else {
              nextAnswers[index] = {
                selected: prevState.selected,
                checked: true,
                isCorrect: prevState.selected === questions[index].answer,
              };
            }
          } else {
            nextAnswers[index] = {
              selected: prevState.selected,
            };
          }
        });

        return Object.keys(nextAnswers).length > 0
          ? nextAnswers
          : prevAnswers;
      });

      return nextMode;
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-(--color-app-text-muted)">
              Quiz progress
            </p>
            <p className="text-lg font-semibold text-(--color-app-text)">
              {submitted
                ? `Score: ${finalScore} / ${questions.length}`
                : checkAsYouGo && answeredCount > 0
                ? `${interimScore} of ${answeredCount} answered correctly`
                : "Select an answer for each question and submit when ready"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleCheckMode}
              disabled={submitted}
              aria-pressed={checkAsYouGo}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent) disabled:cursor-not-allowed disabled:opacity-60 ${
                checkAsYouGo
                  ? "border-emerald-400/80 bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
                  : "border-(--color-app-border) text-(--color-app-text-muted) hover:border-(--color-app-accent) hover:text-(--color-app-text)"
              }`}
            >
              <span
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition ${
                  checkAsYouGo
                    ? "bg-emerald-500/80"
                    : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`absolute left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white transition ${
                    checkAsYouGo ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </span>
              Check as you go
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitted}
              className="inline-flex items-center gap-2 rounded-full bg-(--color-app-accent) px-4 py-2 text-sm font-semibold text-(--color-app-accent-foreground) shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitted ? "Submitted" : "Submit answers"}
            </button>
            {submitted ? (
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 rounded-full border border-(--color-app-border) px-4 py-2 text-sm font-semibold text-(--color-app-text) transition hover:border-(--color-app-accent) hover:text-(--color-app-text)"
              >
                Try again
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <ol className="space-y-6">
        {questions.map((question, index) => {
          const answerState = answers[index];
          const selected = answerState?.selected;
          const isCorrect = answerState?.isCorrect;
          const isChecked = answerState?.checked || submitted;

          return (
            <li
              key={`${question.prompt}-${index}`}
              className="rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-(--color-app-text)">
                    {index + 1}. {question.prompt}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-(--color-app-text-muted)">
                    Choose one option
                  </p>
                </div>
                {isChecked ? (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-200/20 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-200/20 dark:text-rose-300"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Review"}
                  </span>
                ) : null}
              </div>

              <ul className="mt-4 space-y-2 text-sm text-(--color-app-text)">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === option;
                  const isAnswer = submitted && question.answer === option;
                  const showWrong =
                    isChecked && isSelected && question.answer !== option;

                  return (
                    <li key={`${option}-${optionIndex}`}>
                      <button
                        type="button"
                        onClick={() => handleSelect(index, option)}
                        disabled={submitted}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent) disabled:cursor-not-allowed ${
                          isSelected
                            ? "border-(--color-app-accent) bg-(--color-app-accent)/10 text-(--color-app-text)"
                            : "border-(--color-app-border) hover:border-(--color-app-accent)"
                        } ${
                          submitted
                            ? isAnswer
                              ? "border-emerald-400 bg-emerald-400/10 dark:border-emerald-500 dark:bg-emerald-500/10"
                              : showWrong
                              ? "border-rose-400 bg-rose-400/10 dark:border-rose-500 dark:bg-rose-500/10"
                              : ""
                            : isChecked
                            ? option === question.answer
                              ? "border-emerald-400 bg-emerald-400/10 dark:border-emerald-500 dark:bg-emerald-500/10"
                              : showWrong
                              ? "border-rose-400 bg-rose-400/10 dark:border-rose-500 dark:bg-rose-500/10"
                              : ""
                            : ""
                        }`}
                      >
                        <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-(--color-app-border) text-xs font-medium text-(--color-app-text-muted)">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {isChecked ? (
                <div className="mt-4 space-y-2 rounded-xl bg-(--color-app-surface-muted) p-4 text-sm text-(--color-app-text)">
                  <p>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Correct answer:
                    </span>{" "}
                    {question.answer}
                  </p>
                  {question.explanation ? (
                    <p>
                      <span className="font-medium text-(--color-app-text)">
                        Why:
                      </span>{" "}
                      {question.explanation}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

