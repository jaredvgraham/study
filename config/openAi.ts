import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

function ensureClient(): OpenAI {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  cachedClient = new OpenAI({
    apiKey,
  });

  return cachedClient;
}

export const openAi = ensureClient();

