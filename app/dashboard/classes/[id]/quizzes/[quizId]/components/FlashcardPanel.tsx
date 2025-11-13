"use client";

import { useState, useTransition } from "react";
import { generateFlashcardsAction } from "../actions";

type Flashcard = {
  question: string;
  answer: string;
  hint?: string;
};

type FlashcardSetData = {
  title: string;
  cards: Flashcard[];
};

type FlashcardPanelProps = {
  classId: string;
  quizId: string;
  flashcardSet: FlashcardSetData | null;
};

export default function FlashcardPanel({
  classId,
  quizId,
  flashcardSet,
}: FlashcardPanelProps) {
  const [isExpanded, setIsExpanded] = useState(Boolean(flashcardSet));
  const [isPending, startTransition] = useTransition();
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleGenerate = () => {
    startTransition(() => generateFlashcardsAction({ classId, quizId }));
  };

  const toggleExpanded = () => setIsExpanded((prev) => !prev);
  const toggleCard = (index: number) =>
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <section className="space-y-6 rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-(--color-app-text)">Flashcards</h2>
          <p className="text-sm text-(--color-app-text-muted)">
            Turn this material into active recall prompts for quick review.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {flashcardSet ? (
            <button
              type="button"
              onClick={toggleExpanded}
              className="inline-flex items-center gap-2 rounded-full border border-(--color-app-border) px-4 py-2 text-sm font-medium text-(--color-app-text) transition hover:border-(--color-app-accent)"
            >
              {isExpanded ? "Hide cards" : "Show cards"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-(--color-app-accent) px-4 py-2 text-sm font-semibold text-(--color-app-accent-foreground) shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Generating…"
              : flashcardSet
              ? "Regenerate"
              : "Generate flashcards"}
          </button>
        </div>
      </header>

      {isPending && (
        <p className="text-sm text-(--color-app-text-muted)">
          Building a new deck. This usually takes a few seconds.
        </p>
      )}

      {flashcardSet && isExpanded ? (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-(--color-app-text)">
            {flashcardSet.title}
          </h3>
          <p className="text-xs text-(--color-app-text-muted)">
            Tap a card to flip it and reveal the answer. Regenerate at any time for a
            fresh deck.
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {flashcardSet.cards.map((card, index) => (
              <li key={`${card.question}-${index}`} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => toggleCard(index)}
                  className="group relative h-52 w-full rounded-2xl border border-(--color-app-border) bg-transparent text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-app-accent)"
                >
                  <div
                    className={`relative h-full w-full rounded-2xl bg-(--color-app-surface) p-5 shadow-sm transition-transform duration-500 transform-gpu [transform-style:preserve-3d] ${
                      flippedCards[index] ? "rotate-y-180" : ""
                    }`}
                  >
                    <div className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl bg-(--color-app-surface) text-(--color-app-text) [backface-visibility:hidden]">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-(--color-app-text-muted)">
                          Question {index + 1}
                        </h4>
                        <p className="text-base font-medium leading-6">
                          {card.question}
                        </p>
                      </div>
                      {card.hint ? (
                        <p className="text-xs text-(--color-app-text-muted)">
                          Hint: {card.hint}
                        </p>
                      ) : (
                        <p className="text-xs text-(--color-app-text-muted)">
                          Tap to reveal the answer.
                        </p>
                      )}
                    </div>
                    <div className="absolute inset-0 flex h-full w-full rotate-y-180 flex-col justify-between rounded-2xl bg-(--color-app-accent) p-5 text-(--color-app-accent-foreground) [backface-visibility:hidden]">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wide">
                          Answer
                        </h4>
                        <p className="text-base font-medium leading-6">
                          {card.answer}
                        </p>
                      </div>
                      <p className="text-xs">Tap again to flip back.</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!flashcardSet && !isPending ? (
        <p className="text-sm text-(--color-app-text-muted)">
          No flashcards yet. Generate a deck to give students quick practice prompts.
        </p>
      ) : null}
    </section>
  );
}

