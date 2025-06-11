import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("file") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-transcribe",
      language: "fi", // Use "fi" for Finnish, change as needed for other languages
      response_format: "text",
    });

    return NextResponse.json({ text: transcription });
  } catch (error: Error | unknown) {
    console.error("Error transcribing audio:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to transcribe audio";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
