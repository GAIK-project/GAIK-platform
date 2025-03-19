import { openAIembeddings } from "@/ai/middleware/index";
import { db } from "@/lib/db/drizzle/drizzle";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";

//used seed route as base to make this route that should make table for new rag model and store embeddings there
export async function POST(request: NextRequest) {
  try {
    const { assistantName, textData, systemPrompt } = await request.json();

    if (!assistantName || !textData || !systemPrompt) {
      return NextResponse.json({ error: "Missing assistantName or textData" }, { status: 400 });
    }

    // Sanitize table name to avoid SQL injection risks
    const sanitizedTableName = assistantName.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

    // Dynamically create a table for this assistantName if it doesn't exist
    await db.execute(
      sql.raw(`
        CREATE TABLE IF NOT EXISTS "${sanitizedTableName}" (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          metadata JSONB,
          embedding VECTOR(1536) -- Assuming OpenAI embedding size
        );
      `)
    );

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([textData]);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await openAIembeddings.embedQuery(chunk.pageContent);

      const embeddingArray = embedding.map((val: number) => parseFloat(val.toFixed(6)));

      await db.execute(
        sql`
          INSERT INTO "${sql.raw(sanitizedTableName)}" (content, metadata, embedding)
          VALUES (
            ${chunk.pageContent},
            ${JSON.stringify({
              chunkIndex: i,
              totalChunks: chunks.length,
            })},
            ${sql.raw(`ARRAY[${embeddingArray.join(",")}]::vector`)}
          )
        `
      );
    }

    return NextResponse.json({
      success: true,
      metadata: {
        chunksProcessed: chunks.length,
      },
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 },
    );
  }
}
