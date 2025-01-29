import { openai } from "@ai-sdk/openai";
import {
  LanguageModelV1CallOptions,
  LanguageModelV1Message,
  LanguageModelV1TextPart,
} from "@ai-sdk/provider";
import { CoreMessage, generateObject } from "ai";
import { searchDocuments } from "../actions/search";

// Helper function to get last user message text
export const getLastUserMessageText = (
  messages: CoreMessage[],
): string | null => {
  const lastMessage = messages.at(-1);
  if (lastMessage?.role !== "user") return null;

  return typeof lastMessage.content === "string"
    ? lastMessage.content
    : (lastMessage.content.find((part) => part.type === "text")?.text ?? null);
};

// Helper function to find relevant sources
export const findSources = async (text: string) => {
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

    // Haetaan relevantit dokumentit
    return await searchDocuments(text, 5);
  } catch (error) {
    console.error("Error finding sources:", error);
    return [];
  }
};

// Helper function to add context to the last message
export const addToLastUserMessage = (
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
