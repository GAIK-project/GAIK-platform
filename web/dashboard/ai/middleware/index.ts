//app/ai/index.ts
import { openai } from "@ai-sdk/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { wrapLanguageModel } from "ai";
import { createHydeMiddleware } from "./hyde-rag";
import { createMultiStagellmMiddleware } from "./multistage-rag";

const BASE_MODEL = "gpt-4o";

export const createMultiStageRag = (
  modelName: string = BASE_MODEL,
  customModel: string,
) => {
  return wrapLanguageModel({
    model: openai(modelName),
    middleware: createMultiStagellmMiddleware(customModel),
  });
};

export const createHydeRag = (modelName: string, customModel: string) => {
  return wrapLanguageModel({
    model: openai(modelName),
    middleware: createHydeMiddleware(customModel),
  });
};

export const openAIembeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  dimensions: 1536,
});

// export const multiStageModel = createMultiStageRag();
// export const hydeModel = createHydeRag();
