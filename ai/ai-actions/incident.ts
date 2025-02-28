"use server";

import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

// Define the schema for the incident report
const incidentReportSchema = z.object({
  reportTitle: z.string().describe("The title of the incident report"),
  incidentSummary: z.string().describe("A summary description of the incident"),
  causeAnalysis: z.string().describe("Analysis of what caused the incident"),
  recommendedActions: z
    .string()
    .describe("Recommendations to avoid future incidents"),
  incidentTimestamp: z.string().describe("The timestamp of the incident"),
});

export async function processIncidentReport(incidentDetails: string) {
  const stream = createStreamableValue();

  (async () => {
    try {
      // Build the prompt template
      const prompt = `
        Generate an incident report based on the following details. The report should include:
        - A report title
        - A concise summary of the incident
        - Analysis of the possible cause(s)
        - Recommended actions to prevent future incidents
        - The timestamp of the incident

        Incident Details: ${incidentDetails}
      `;

      const { partialObjectStream } = streamObject({
        model: openai("o3-mini", { structuredOutputs: true }),
        schema: incidentReportSchema,
        prompt,
        providerOptions: {
          openai: {
            reasoningEffort: "medium",
          },
        },
      });

      for await (const partialObject of partialObjectStream) {
        stream.update(partialObject);
      }

      stream.done();
    } catch (error: any) {
      console.error("Error processing incident report:", error);
      stream.error(error);
    }
  })();

  return { object: stream.value };
}
