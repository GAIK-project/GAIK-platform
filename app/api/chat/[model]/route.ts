import { modelConfigs } from "@/lib/config/models";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

type ModelType = keyof typeof modelConfigs;

// Named export POST-metodille
export async function POST(
  req: NextRequest,
  { params }: { params: { model: string } },
) {
  // Tarkista heti alussa onko malli tuettu
  if (!modelConfigs[params.model as ModelType]) {
    return NextResponse.json(
      {
        error: "Unsupported model",
        availableModels: Object.keys(modelConfigs),
      },
      { status: 400 },
    );
  }

  try {
    const { messages } = await req.json();
    const config = modelConfigs[params.model as ModelType];

    const result = streamText({
      model: config.provider(),
      messages,
      system: config.system,
      maxSteps: config.maxSteps,
      tools: config.tools,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error(`Error in ${params.model} chat:`, err);
    return NextResponse.json(
      { error: "Chat processing failed" },
      { status: 500 },
    );
  }
}

// Named export GET-metodille
export async function GET(
  req: NextRequest,
  { params }: { params: { model: string } },
) {
  return NextResponse.json({
    supported: params.model in modelConfigs,
    availableModels: Object.keys(modelConfigs),
  });
}
