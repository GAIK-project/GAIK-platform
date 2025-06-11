// Define your models here.

export interface Model {
  id: string;
  label: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    description: "For complex, multi-step tasks",
  },
  {
    id: "hyde-rag",
    label: "HyDE-RAG",
    description: "GPT-4o with custom retrieval",
  },
  {
    id: "multi-stage-rag",
    label: "Multi-Stage-RAG",
    description: "GPT-4o with custom retrieval",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
