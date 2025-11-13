declare module "openai" {
  type ChatMessageRole = "system" | "user" | "assistant";

  export type ChatCompletionChoice = {
    message?: {
      role: ChatMessageRole;
      content?: string;
    };
  };

  export type ChatCompletion = {
    choices?: ChatCompletionChoice[];
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };

  export default class OpenAI {
    constructor(config: { apiKey: string });
    chat: {
      completions: {
        create(params: {
          model: string;
          messages: Array<{ role: ChatMessageRole; content: string }>;
          response_format?: { type: string };
        }): Promise<ChatCompletion>;
      };
    };
  }
}

