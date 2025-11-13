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
