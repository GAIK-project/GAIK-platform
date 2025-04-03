import { createHydeRag, createMultiStageRag } from "@/ai/middleware";
import { openai } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";
export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages, modelId, customModel } = await request.json();

  let selectedModel;

  const BASE_MODEL = "gpt-4o";

  switch (modelId) {
    case "hyde-rag":
      selectedModel = createHydeRag(BASE_MODEL, customModel);
      break;
    case "multi-stage-rag":
      selectedModel = createMultiStageRag(BASE_MODEL, customModel);
      break;
    default:
      selectedModel = openai(modelId || "gpt-4o-mini");
  }

  const result = streamText({
    model: selectedModel,
    system:
      "You are helpful assistant. Keep the answers short and to the point.",
    messages: messages,
    experimental_transform: smoothStream(),
  });

  return result.toDataStreamResponse({});
}
