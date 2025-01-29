//app/ai/index.ts
import { openai } from "@ai-sdk/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { hydeMiddleware } from "./hyde-rag";
import { multiStagellmMiddleware } from "./multistage-rag";

const BASE_MODEL = "gpt-4o-2024-11-20";

export const createMultiStageRag = (modelName: string = BASE_MODEL) => {
  return wrapLanguageModel({
    model: openai(modelName),
    middleware: multiStagellmMiddleware,
  });
};

export const createHydeRag = (modelName: string = BASE_MODEL) => {
  return wrapLanguageModel({
    model: openai(modelName),
    middleware: hydeMiddleware,
  });
};

export const openAIembeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  dimensions: 1536,
});

export const multiStageModel = createMultiStageRag();
export const hydeModel = createHydeRag();
