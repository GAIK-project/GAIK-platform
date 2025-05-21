import { searchDocuments } from "@/ai/ai-actions/search_ragbuilder";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

interface Document {
  content: string;
  // other properties your documents might have
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    const documents = await searchDocuments(latestMessage, 10);
    const docContext = JSON.stringify(
      documents.map((d: Document) => d.content)
    );

    const template = {
      role: "system",
      content: `You are an AI assistant. Use the below context. START CONTEXT ${docContext} END CONTEXT. QUESTION: ${latestMessage}`,
    };

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [template, ...messages],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error handling chat route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
