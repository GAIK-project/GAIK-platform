// import { openAIembeddings } from "@/ai/middleware/index";
// import { db } from "@/lib/db/drizzle/drizzle";
// import { assistants } from "@/lib/db/drizzle/schema";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { NextRequest, NextResponse } from "next/server";
// import { scrapePage } from "@/lib/ragbuilder/autoScraper";
// import { sql } from "drizzle-orm";
// import { sanitizeTableName } from "@/app/utils/functions/functions";

// const MAX_ASSISTANT_NAME_LENGTH = 30;
// const MAX_SYSTEM_PROMPT_LENGTH = 500;
// const MAX_LINKS_COUNT = 5;
// const MAX_LINK_LENGTH = 300;

// export async function POST(request: NextRequest) {
//     try {
//       const formData = await request.formData();

//       // Get JSON data (sent as "data")
//       const dataString = formData.get('data') as string;
//       const { assistantName, links, systemPrompt } = JSON.parse(dataString);
      
//       //check for missing values
//       if (!assistantName || !links || !systemPrompt) {
//         return NextResponse.json({ error: "Missing req data" }, { status: 400 });
//       }

//       // Type checks
//       if (typeof assistantName !== "string" || typeof systemPrompt !== "string" || !Array.isArray(links)) {
//         return NextResponse.json({ error: "Invalid types: assistantName and systemPrompt should be strings, links should be an array" }, { status: 400 });
//       }

//       // Length checks
//       if (assistantName.length > MAX_ASSISTANT_NAME_LENGTH) {
//           return NextResponse.json({ error: `assistantName is too long (max ${MAX_ASSISTANT_NAME_LENGTH} characters)` }, { status: 400 });
//       }

//       if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
//           return NextResponse.json({ error: `systemPrompt is too long (max ${MAX_SYSTEM_PROMPT_LENGTH} characters)` }, { status: 400 });
//       }

//       if (links.length > MAX_LINKS_COUNT) {
//           return NextResponse.json({ error: `Too many links (max ${MAX_LINKS_COUNT})` }, { status: 400 });
//       }

//       // Validate each link
//       if (!links.every(link => typeof link === "string" && link.length <= MAX_LINK_LENGTH)) {
//           return NextResponse.json({ error: `Each link must be a string with max ${MAX_LINK_LENGTH} characters` }, { status: 400 });
//       }
  
//       const safeTableName = sanitizeTableName(assistantName);
  
//       //create assistants table if not exists
//       await db.execute(
//         sql.raw(`
//           CREATE TABLE IF NOT EXISTS "assistants" (
//             id SERIAL PRIMARY KEY,
//             assistant_name TEXT NOT NULL,
//             system_prompt TEXT NOT NULL,
//             current_chunk INTEGER NOT NULL,
//             total_chunks INTEGER NOT NULL,
//             task_completed BOOLEAN NOT NULL DEFAULT FALSE,
//             created_at TIMESTAMP NOT NULL DEFAULT NOW()
//           );
//         `)
//       );

//       // Create dynamic table for new assistant
//       await db.execute(
//         sql.raw(`
//           CREATE TABLE IF NOT EXISTS "${safeTableName}" (
//             id SERIAL PRIMARY KEY,
//             content TEXT NOT NULL,
//             metadata JSONB,
//             embedding VECTOR(1536)
//           );
//         `)
//       );
      
//       //setup textsplitter
//       const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000,
//         chunkOverlap: 200,
//       });

//       // 1. Collect all chunks
//       let allChunks: { pageContent: string, link: string }[] = [];

//       for await (const url of links) {
//           const content = await scrapePage(url);
//           if (!content) continue;
//           const chunks = await splitter.createDocuments([content]);
//           chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: url }));
//       }

//       // 2. Create assistant once
//       const [assistantRow] = await db
//           .insert(assistants)
//           .values({
//               assistantName,
//               systemPrompt,
//               currentChunk: 0,
//               totalChunks: allChunks.length,
//               taskCompleted: false,
//           })
//           .returning();

//       // 3. Batch insert chunks and embeddings
//       const BATCH_SIZE = 50;

//       for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
//           const batch = allChunks.slice(i, i + BATCH_SIZE);

//           // Embed in parallel
//           const embeddings = await Promise.all(
//               batch.map(chunk => openAIembeddings.embedQuery(chunk.pageContent))
//           );

//           // Prepare bulk insert
//           const valuesSql = batch.map((chunk, idx) => {
//               const embeddingArray = embeddings[idx].map((val: number) => parseFloat(val.toFixed(6)));
//               return sql`(${chunk.pageContent}, ${JSON.stringify({
//                   chunkIndex: i + idx,
//                   totalChunks: allChunks.length,
//                   link: chunk.link,
//               })}, ${sql.raw(`ARRAY[${embeddingArray.join(",")}]::vector`)})`;
//           });

//           await db.execute(
//               sql`
//               INSERT INTO "${sql.raw(safeTableName)}" (content, metadata, embedding)
//               VALUES ${sql.join(valuesSql, sql`, `)}
//               `
//           );

//           // 4. Update progress less often
//           await db
//               .update(assistants)
//               .set({
//                   currentChunk: Math.min(i + BATCH_SIZE, allChunks.length),
//                   taskCompleted: i + BATCH_SIZE >= allChunks.length,
//               })
//               .where(sql`${assistants.id} = ${assistantRow.id}`);
//           }

//       return NextResponse.json({
//         success: true,
//         metadata: {
//           safeTableName,
//           totalChunks: allChunks.length //here figure out what is the total amount of chunks,
//         },
//       });
//     } catch (error) {
//       console.error("Error processing document:", error);
//       return NextResponse.json(
//         { error: "Failed to process document" },
//         { status: 500 },
//       );
//     }
//   }
  