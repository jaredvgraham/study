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
};

export default function QuizRunner({ questions }: QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) {
      return 0;
    }
    return questions.reduce((total, question, index) => {
      const entry = answers[index];
      return entry?.isCorrect ? total + 1 : total;
    }, 0);
  }, [answers, questions, submitted]);

  const handleSelect = (questionIndex: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        selected: option,
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
      };
    });

    setAnswers(evaluated);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Quiz progress
            </p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {submitted
                ? `Score: ${score} / ${questions.length}`
                : "Select an answer for each question and submit when ready"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitted}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
            >
              {submitted ? "Submitted" : "Submit answers"}
            </button>
            {submitted ? (
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
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

          return (
            <li
              key={`${question.prompt}-${index}`}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {index + 1}. {question.prompt}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    Choose one option
                  </p>
                </div>
                {submitted ? (
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

              <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === option;
                  const isAnswer = submitted && question.answer === option;
                  const showWrong =
                    submitted && isSelected && question.answer !== option;

                  return (
                    <li key={`${option}-${optionIndex}`}>
                      <button
                        type="button"
                        onClick={() => handleSelect(index, option)}
                        disabled={submitted}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 disabled:cursor-not-allowed ${
                          isSelected
                            ? "border-zinc-900 bg-zinc-900/5 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-100/10 dark:text-zinc-100"
                            : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                        } ${
                          submitted
                            ? isAnswer
                              ? "border-emerald-400 bg-emerald-400/10 dark:border-emerald-500 dark:bg-emerald-500/10"
                              : showWrong
                              ? "border-rose-400 bg-rose-400/10 dark:border-rose-500 dark:bg-rose-500/10"
                              : ""
                            : ""
                        }`}
                      >
                        <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-zinc-300 text-xs font-medium text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {submitted ? (
                <div className="mt-4 space-y-2 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  <p>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Correct answer:
                    </span>{" "}
                    {question.answer}
                  </p>
                  {question.explanation ? (
                    <p>
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">
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

