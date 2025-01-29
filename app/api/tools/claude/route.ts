import { strReplaceEditor } from "@/lib/ai/tools/str-replace-editor";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Luetaan multipart-lomake
    const formData = await req.formData();

    // 2. Haetaan "messages"
    const messagesRaw = formData.get("messages");
    if (typeof messagesRaw !== "string") {
      return new Response("Missing messages JSON", { status: 400 });
    }
    const messages = JSON.parse(messagesRaw);

    // 3. Onko file? -> liitetään user-viestiin
    const file = formData.get("file") as File | null;
    if (file) {
      const arrayBuf = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      // Lisätään user-viesti
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "Here is my attached file." },
          {
            type: "file",
            data: buffer,
            mimeType: file.type || "application/pdf",
          },
        ],
      });
    }

    const systemMsg = `You are a helpful AI. You have a 'str_replace_editor' tool for editing in-memory text files. Always produce a final assistant answer describing what you did.`;

    // 4. Kutsutaan Anthropic + str_replace_editor (in-memory)
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages,
      system: systemMsg,
      maxSteps: 5,
      tools: {
        // avain "str_replace_editor" -> LLM näkee sen nimellä str_replace_editor
        str_replace_editor: strReplaceEditor,
      },

      onFinish({ text }) {
        // Server-konsoliin
        console.log("Claude final text:", text);
      },
      onStepFinish(payload) {
        // Debug: näe jokaisen stepin tool-calls yms:
        console.log("Step finished:", payload.stepType, payload.text);
      },
    });

    // 5. Palautetaan SSE
    return result.toTextStreamResponse({});
  } catch (err) {
    console.error("Claude route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
