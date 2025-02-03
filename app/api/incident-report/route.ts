// app/api/incident-report/route.ts
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {

  const incidentReportSchema = z.object({
    reportTitle: z.string().describe("The title of the incident report"),
    incidentSummary: z.string().describe("A summary description of the incident"),
    causeAnalysis: z.string().describe("Analysis of what caused the incident"),
    recommendedActions: z.string().describe("Recommendations to avoid future incidents"),
    incidentTimestamp: z.string().describe("The timestamp of the incident"),
  });
  
  try {
    // Get incident details from the request body
    const { incidentDetails } = await request.json();

    // Build a prompt that uses a predefined template
    const prompt = `
Generate an incident report based on the following details. The report should include:
- A report title
- A concise summary of the incident
- Analysis of the possible cause(s)
- Recommended actions to prevent future incidents
- The timestamp of the incident

Incident Details: ${incidentDetails}
    `;

    // Use generateObject to produce structured output from the o3-mini reasoning model
    const { object } = await generateObject({
      model: openai("o3-mini", { structuredOutputs: true }),
      schema: incidentReportSchema,
      prompt,
      providerOptions: {
        openai: {
          reasoningEffort: 'medium',
        },
      },
    });

    // Return the generated report as JSON
    return NextResponse.json(object);
  } catch (error: any) {
    console.error("Error generating incident report:", error);
    return NextResponse.json(
      { error: error.message || "Error generating report." },
      { status: 500 }
    );
  }
}
