import { openAIembeddings } from "@/ai/middleware/index";
import { db } from "@/lib/db/drizzle/drizzle";
import { assistants } from "@/lib/db/drizzle/schema";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { assistantName, textData, systemPrompt } = await request.json();

    if (!assistantName || !textData || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing assistantName, textData, or systemPrompt" },
        { status: 400 },
      );
    }

    const safeTableName = assistantName.replace(/[^a-zA-Z0-9_]/g, "");

    //create assistants table if not exists
    await db.execute(
      sql.raw(`
        CREATE TABLE IF NOT EXISTS "assistants" (
        id SERIAL PRIMARY KEY,
        assistant_name TEXT NOT NULL,
        system_prompt TEXT NOT NULL,
        current_chunk INTEGER NOT NULL,
        total_chunks INTEGER NOT NULL,
        task_completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `),
    );

    // Ensure dynamic table exists
    await db.execute(
      sql.raw(`
        CREATE TABLE IF NOT EXISTS "${safeTableName}" (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          metadata JSONB,
          embedding VECTOR(1536)
        );
      `),
    );

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([textData]);

    // Insert assistant metadata once
    const [assistantRow] = await db
      .insert(assistants)
      .values({
        assistantName,
        owner: "system", // Adding required owner field
        systemPrompt,
        currentChunk: 0,
        totalChunks: chunks.length,
        taskCompleted: false,
      })
      .returning();

    // Generate embeddings in parallel
    const embeddings = await Promise.all(
      chunks.map((chunk) => openAIembeddings.embedQuery(chunk.pageContent)),
    );

    // Prepare batch insert array
    const valuesSql = chunks.map((chunk, i) => {
      const embeddingArray = embeddings[i].map((val: number) =>
        parseFloat(val.toFixed(6)),
      );
      return sql`(${chunk.pageContent}, ${JSON.stringify({
        chunkIndex: i,
        totalChunks: chunks.length,
      })}, ${sql.raw(`ARRAY[${embeddingArray.join(",")}]::vector`)})`;
    });

    // Single DB insert for all chunks
    await db.execute(
      sql`
        INSERT INTO "${sql.raw(safeTableName)}" (content, metadata, embedding)
        VALUES ${sql.join(valuesSql, sql`, `)}
      `,
    );

    // Update assistant to mark task as completed
    await db
      .update(assistants)
      .set({
        currentChunk: chunks.length,
        taskCompleted: true,
      })
      .where(sql`${assistants.id} = ${assistantRow.id}`);

    return NextResponse.json({
      success: true,
      metadata: {
        assistantName,
        totalChunks: chunks.length,
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
