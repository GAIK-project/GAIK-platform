import { openai } from "@ai-sdk/openai";
import {
  LanguageModelV1CallOptions,
  LanguageModelV1Message,
  LanguageModelV1TextPart,
} from "@ai-sdk/provider";
import {
  CoreMessage,
  Experimental_LanguageModelV1Middleware,
  generateObject,
  generateText,
} from "ai";
import { searchDocuments } from "../actions/search";

// Helper function to get last user message text
const getLastUserMessageText = (messages: CoreMessage[]): string | null => {
  const lastMessage = messages.at(-1);
  if (lastMessage?.role !== "user") return null;

  return typeof lastMessage.content === "string"
    ? lastMessage.content
    : (lastMessage.content.find((part) => part.type === "text")?.text ?? null);
};

// Helper function to find relevant sources
const findSources = async (text: string) => {
  try {
    // Classify the user message
    const { object: classification } = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      output: "enum",
      enum: ["question", "statement", "other"] as const,
      system: "classify the user message as a question, statement, or other",
      prompt: text,
    });
    console.log("classification", classification);

    // If the message is not a question, return empty array
    if (classification !== "question") {
      return [];
    }

    // Generate hypothetical answer for better retrieval
    const { text: hypotheticalAnswer } = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "Generate a detailed hypothetical answer to the user's question. Include specific details that might be relevant for retrieval.",
      prompt: text,
    });
    console.log("hypotheticalAnswer", hypotheticalAnswer);

    // Retrieve relevant sources
    return await searchDocuments(hypotheticalAnswer, 5);
  } catch (error) {
    console.error("Error finding sources:", error);
    return [];
  }
};

// Helper function to add context to the last message
const addToLastUserMessage = (
  params: LanguageModelV1CallOptions,
  context: string,
): LanguageModelV1CallOptions => {
  const messages = [...params.prompt];
  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== "user") {
    return params;
  }

  const originalContent = Array.isArray(lastMessage.content)
    ? (lastMessage.content as LanguageModelV1TextPart[])
        .map((part) => part.text)
        .join("\n")
    : lastMessage.content;

  const updatedMessage: LanguageModelV1Message = {
    role: "user",
    content: [
      { type: "text", text: originalContent } as LanguageModelV1TextPart,
      { type: "text", text: "\n\n" + context } as LanguageModelV1TextPart,
    ],
  };

  return {
    ...params,
    prompt: [...messages.slice(0, -1), updatedMessage],
  };
};

// RAG Middleware
export const hydeMiddleware: Experimental_LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    try {
      const userMessage = getLastUserMessageText(params.prompt);
      if (!userMessage || userMessage.length < 6) {
        return params;
      }
      console.log("edetään", userMessage);

      const sources = await findSources(userMessage);
      if (!sources.length) {
        return params;
      }
      console.log("SOURCES--------------", JSON.stringify(sources, null, 2));

      const context =
        "Use the following information to answer the question:\n" +
        sources.map((source) => source.content).join("\n\n");

      return addToLastUserMessage(params, context);
    } catch (error) {
      console.error("Error in RAG middleware:", error);
      return params;
    }
  },
};
