import { anthropic } from "@ai-sdk/anthropic";
import { CoreMessage, generateText } from "ai";
import { NextRequest } from "next/server";

/*
Reads a file and sends it to Claude for analysis.
*/

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const instruction =
      (formData.get("instruction") as string) ||
      "Analyze this document please.";

    if (!file) {
      return new Response("Missing file", { status: 400 });
    }

    // Luetaan tiedosto
    const arrayBuf = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuf);

    // Luodaan viesti Claudelle
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: instruction,
            citations: { enabled: true },
          },
          {
            type: "file",
            data: fileData,
            mimeType: file.type || "application/pdf",
          },
        ],
      },
    ] as CoreMessage[];
    console.log("starting Claude with messages:");

    // Käytetään Vercel AI SDK:ta streamin luomiseen
    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages,
    });

    console.log("Claude result:", text);
    return Response.json({ text });
  } catch (err) {
    console.error("Claude route error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
