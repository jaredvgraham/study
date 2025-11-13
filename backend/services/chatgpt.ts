import { openAi } from "@/config/openAi";

const MODEL = process.env.OPENAI_QUIZ_MODEL ?? "gpt-5-mini";

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export type GeneratedQuiz = {
  title: string;
  questions: QuizQuestion[];
};

export type StudyGuideSection = {
  heading: string;
  content: string;
  bulletPoints?: string[];
};

export type GeneratedStudyGuide = {
  title: string;
  summary: string;
  sections: StudyGuideSection[];
};

export type Flashcard = {
  question: string;
  answer: string;
  hint?: string;
};

export type GeneratedFlashcardSet = {
  title: string;
  cards: Flashcard[];
};

type QuizRequest = {
  className: string;
  context: string;
  questionCount?: number;
};

const SYSTEM_PROMPT = `You are Sonexa, an educational assistant that prepares concise study quizzes.

Respond strictly in JSON with the shape:
{
  "title": string,
  "questions": [
    {
      "prompt": string,
      "options": string[],
      "answer": string,
      "explanation": string
    }
  ]
}

Guidelines:
- Tailor the quiz to the provided class name and context.
- Provide only 4 options per question.
- Keep explanations brief (1-2 sentences).
- Do not include any additional text outside the JSON payload.`;

export async function generateQuiz({
  className,
  context,
  questionCount = 20,
}: QuizRequest): Promise<GeneratedQuiz> {
  const trimmedContext = context.trim();

  if (!trimmedContext) {
    throw new Error("Cannot generate quiz without class context.");
  }

  const completion = await openAi.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Create a ${questionCount}-question multiple-choice quiz for the class "${className}". Use this context:\n\n${trimmedContext}`,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content ?? "";

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (parseError) {
    throw new Error("Received invalid JSON from ChatGPT.");
  }

  if (!isGeneratedQuiz(parsed)) {
    throw new Error("Quiz generation returned unexpected structure.");
  }

  return parsed;
}

const STUDY_GUIDE_PROMPT = `You are Sonexa, an educational assistant. Produce structured study guides in JSON with the shape:
{
  "title": string,
  "summary": string,
  "sections": [
    {
      "heading": string,
      "content": string,
      "bulletPoints": string[]
    }
  ]
}

Guidelines:
- Craft 3-5 sections that cover the most important ideas.
- Keep the summary under ~120 words.
- Bullet points should be concise (10 words or fewer).
- Never add extra text outside the JSON.`;

export async function generateStudyGuide({
  className,
  context,
}: {
  className: string;
  context: string;
}): Promise<GeneratedStudyGuide> {
  const trimmed = context.trim();

  if (!trimmed) {
    throw new Error("Cannot generate study guide without context.");
  }

  const completion = await openAi.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: STUDY_GUIDE_PROMPT },
      {
        role: "user",
        content: `Create a study guide for the "${className}" class using the following material:\n\n${trimmed}`,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content ?? "";

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Received invalid JSON from ChatGPT for study guide.");
  }

  if (!isGeneratedStudyGuide(parsed)) {
    throw new Error("Study guide generation returned unexpected structure.");
  }

  return parsed;
}

const FLASHCARD_PROMPT = `You are Sonexa, an educational assistant. Produce flashcards in JSON with the shape:
{
  "title": string,
  "cards": [
    {
      "question": string,
      "answer": string,
      "hint": string
    }
  ]
}

Guidelines:
- Provide 10 flashcards unless fewer concepts exist.
- Questions should be clear and answerable in one sentence.
- Hints are optional; include them when they reinforce retrieval cues.
- Never return text outside the JSON.`;

export async function generateFlashcards({
  className,
  context,
}: {
  className: string;
  context: string;
}): Promise<GeneratedFlashcardSet> {
  const trimmed = context.trim();

  if (!trimmed) {
    throw new Error("Cannot generate flashcards without context.");
  }

  const completion = await openAi.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: FLASHCARD_PROMPT },
      {
        role: "user",
        content: `Generate a flashcard deck for the "${className}" class using this material:\n\n${trimmed}`,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content ?? "";

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Received invalid JSON from ChatGPT for flashcards.");
  }

  if (!isGeneratedFlashcardSet(parsed)) {
    throw new Error("Flashcard generation returned unexpected structure.");
  }

  return parsed;
}

function isGeneratedQuiz(payload: unknown): payload is GeneratedQuiz {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const value = payload as GeneratedQuiz;

  if (typeof value.title !== "string" || !value.title.trim()) {
    return false;
  }

  if (!Array.isArray(value.questions) || value.questions.length === 0) {
    return false;
  }

  return value.questions.every((question) => {
    if (!question || typeof question !== "object") {
      return false;
    }

    const { prompt, options, answer, explanation } = question as Record<
      string,
      unknown
    >;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return false;
    }

    if (!Array.isArray(options) || options.length < 2) {
      return false;
    }

    if (
      !options.every((option) => typeof option === "string" && option.trim())
    ) {
      return false;
    }

    if (typeof answer !== "string" || !answer.trim()) {
      return false;
    }

    if (
      explanation !== undefined &&
      explanation !== null &&
      typeof explanation !== "string"
    ) {
      return false;
    }

    return true;
  });
}

function isGeneratedStudyGuide(
  payload: unknown
): payload is GeneratedStudyGuide {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const value = payload as GeneratedStudyGuide;

  if (typeof value.title !== "string" || !value.title.trim()) {
    return false;
  }

  if (typeof value.summary !== "string" || !value.summary.trim()) {
    return false;
  }

  if (!Array.isArray(value.sections) || value.sections.length === 0) {
    return false;
  }

  return value.sections.every((section) => {
    if (!section || typeof section !== "object") {
      return false;
    }

    const { heading, content, bulletPoints } = section as Record<
      string,
      unknown
    >;

    if (typeof heading !== "string" || !heading.trim()) {
      return false;
    }

    if (typeof content !== "string" || !content.trim()) {
      return false;
    }

    if (bulletPoints !== undefined) {
      if (!Array.isArray(bulletPoints)) {
        return false;
      }

      if (
        !bulletPoints.every(
          (point) => typeof point === "string" && point.trim()
        )
      ) {
        return false;
      }
    }

    return true;
  });
}

function isGeneratedFlashcardSet(
  payload: unknown
): payload is GeneratedFlashcardSet {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const value = payload as GeneratedFlashcardSet;

  if (typeof value.title !== "string" || !value.title.trim()) {
    return false;
  }

  if (!Array.isArray(value.cards) || value.cards.length === 0) {
    return false;
  }

  return value.cards.every((card) => {
    if (!card || typeof card !== "object") {
      return false;
    }

    const { question, answer, hint } = card as Record<string, unknown>;

    if (typeof question !== "string" || !question.trim()) {
      return false;
    }

    if (typeof answer !== "string" || !answer.trim()) {
      return false;
    }

    if (hint !== undefined && hint !== null && typeof hint !== "string") {
      return false;
    }

    return true;
  });
}
