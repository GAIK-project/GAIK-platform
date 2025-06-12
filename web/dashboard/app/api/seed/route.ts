import { openAIembeddings } from "@/ai/middleware/index";
import { db } from "@/lib/db/drizzle/drizzle";
import { documents } from "@/lib/db/drizzle/schema";
import { processPdfFile } from "@/lib/helpers/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large" },
        { status: 400 },
      );
    }
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Process PDF file
    const { text, metadata } = await processPdfFile(file);

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      // separators: ["Maarit Hynninen-Ojala", "Tunnistetiedot", 'Kuvat \n', "\n\nAsiakirjan otsikon ja leipätekstin tyylit\n\n", "Merkitse työsi viimeiseksi"],
      // Oletusseparaattorit: ["\n\n", "\n", " ", ""]
    });

    const chunks = await splitter.createDocuments([text]);
    // Process each chunk
    for (const chunk of chunks) {
      // Generate embedding
      const embedding = await openAIembeddings.embedQuery(chunk.pageContent);

      // Store in database
      await db.insert(documents).values({
        content: chunk.pageContent,
        metadata: {
          ...metadata,
          chunkIndex: chunks.indexOf(chunk),
          totalChunks: chunks.length,
        },
        embedding,
      });
    }

    return NextResponse.json({
      success: true,
      metadata: {
        fileName: file.name,
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
