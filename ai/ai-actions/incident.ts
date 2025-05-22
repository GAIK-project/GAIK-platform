"use server";

import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { cookies } from "next/headers";
import { z } from "zod";

/**
 * Check if the user is in guest mode.
 */
async function checkGuestModeAccess() {
  const cookieStore = await cookies();
  const isGuestMode = cookieStore.get("guest-mode")?.value === "true";

  if (isGuestMode) {
    throw new Error("Incident reporting is not available in guest mode");
  }
}

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
  // Check if user is in guest mode
  await checkGuestModeAccess();

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
    } catch (error: unknown) {
      console.error("Error processing incident report:", error);
      stream.error(error);
    }
  })();

  return { object: stream.value };
}
