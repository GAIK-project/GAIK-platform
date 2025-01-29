// src/lib/analyzers/material-analysis.ts
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { Analyzer } from "./analysis-pipeline";

// Input tyyppi
interface MaterialInput {
  merkki: string;
  malli: string;
  kuvaus?: string;
}

// Output schema ja tyyppi
const materialSchema = z.object({
  materiaalit: z.array(z.string()),
  päämateriaalit: z.array(z.string()),
});

type MaterialAnalysis = z.infer<typeof materialSchema>;

// Analysaattori
export const geminiMaterialAnalyzer: Analyzer<MaterialInput, MaterialAnalysis> =
  {
    name: "Gemini Material Analyzer",
    analyze: async (input) => {
      const { object } = await generateObject({
        model: openai("gpt-4o-2024-11-20"),
        schema: materialSchema,
        messages: [
          {
            role: "system",
            content: "Olet huonekalujen materiaaliasiantuntija.",
          },
          {
            role: "user",
            content: `
            Analysoi tämän huonekalun materiaalit:
            - Merkki: ${input.merkki}
            - Malli: ${input.malli}
            ${input.kuvaus ? `- Kuvaus: ${input.kuvaus}` : ""}
            
            Anna listaus materiaaleista ja määrittele päämateriaalit.
          `,
          },
        ],
        temperature: 0,
      });

      return object;
    },
  };
