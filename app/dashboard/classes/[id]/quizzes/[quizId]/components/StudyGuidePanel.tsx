"use client";

import { useState, useTransition } from "react";
import { generateStudyGuideAction } from "../actions";

type StudyGuideSection = {
  heading: string;
  content: string;
  bulletPoints?: string[];
};

type StudyGuideData = {
  title: string;
  summary: string;
  sections: StudyGuideSection[];
};

type StudyGuidePanelProps = {
  classId: string;
  quizId: string;
  studyGuide: StudyGuideData | null;
};

export default function StudyGuidePanel({
  classId,
  quizId,
  studyGuide,
}: StudyGuidePanelProps) {
  const [isExpanded, setIsExpanded] = useState(Boolean(studyGuide));
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(() => generateStudyGuideAction({ classId, quizId }));
  };

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <section className="space-y-6 rounded-3xl border border-(--color-app-border) bg-(--color-app-surface) p-6 shadow-sm">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-(--color-app-text)">
            Study guide
          </h2>
          <p className="text-sm text-(--color-app-text-muted)">
            Generate a structured guide to help learners review this quiz&apos;s material.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {studyGuide ? (
            <button
              type="button"
              onClick={toggleExpanded}
              className="inline-flex items-center gap-2 rounded-full border border-(--color-app-border) px-4 py-2 text-sm font-medium text-(--color-app-text) transition hover:border-(--color-app-accent)"
            >
              {isExpanded ? "Hide guide" : "Show guide"}
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
              : studyGuide
              ? "Regenerate"
              : "Generate guide"}
          </button>
        </div>
      </header>

      {isPending && (
        <p className="text-sm text-(--color-app-text-muted)">
          Crafting a fresh study guide. This usually takes a few seconds.
        </p>
      )}

      {studyGuide && isExpanded ? (
        <div className="space-y-6">
          <article className="space-y-3 rounded-2xl border border-(--color-app-border) bg-(--color-app-surface-muted) p-6">
            <h3 className="text-xl font-semibold text-(--color-app-text)">
              {studyGuide.title}
            </h3>
            <p className="text-sm leading-6 text-(--color-app-text-muted)">
              {studyGuide.summary}
            </p>
          </article>
          <div className="space-y-4">
            {studyGuide.sections.map((section) => (
              <article
                key={section.heading}
                className="space-y-3 rounded-2xl border border-(--color-app-border) bg-(--color-app-surface) p-5 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-(--color-app-text)">
                  {section.heading}
                </h4>
                <p className="text-sm text-(--color-app-text-muted)">
                  {section.content}
                </p>
                {section.bulletPoints && section.bulletPoints.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-(--color-app-text)">
                    {section.bulletPoints.map((point, index) => (
                      <li key={`${section.heading}-point-${index}`}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {!studyGuide && !isPending ? (
        <p className="text-sm text-(--color-app-text-muted)">
          No study guide yet. Generate one to summarize the quiz content into digestible
          sections.
        </p>
      ) : null}
    </section>
  );
}

