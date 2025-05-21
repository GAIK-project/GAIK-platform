import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/drizzle";
import { assistants } from "@/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { sanitizeTableName } from "@/app/utils/functions/functions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assistantId = searchParams.get("assistantId");

    if (!assistantId || typeof assistantId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid assistantId parameter" },
        { status: 400 },
      );
    }

    // Sanitize input (if you want to sanitize IDs too)
    const safeAssistantId = sanitizeTableName(assistantId);
    if (!safeAssistantId) {
      return NextResponse.json(
        { error: "Invalid assistantId after sanitization" },
        { status: 400 },
      );
    }

    // Query the assistant by name (if ID is actually the assistantName)
    const result = await db
      .select()
      .from(assistants)
      .where(eq(assistants.assistantName, safeAssistantId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "No assistant found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Assistant retrieved", data: result[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching assistant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
