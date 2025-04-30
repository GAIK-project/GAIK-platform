import { openAIembeddings } from "@/ai/middleware/index";
import { db } from "@/lib/db/drizzle/drizzle";
import { assistants } from "@/lib/db/drizzle/schema";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextRequest, NextResponse } from "next/server";
import { scrapePage } from "@/lib/ragbuilder/autoScraper";
import { sql } from "drizzle-orm";
import { sanitizeTableName } from "@/app/utils/functions/functions";
import { parsePdfOrDoc, parseTxt, parseImage, parseExcel } from '@/lib/parsers/parser';
import { getFileCategory } from "@/lib/middleware/validateFileType";

const MAX_ASSISTANT_NAME_LENGTH = 30;
const MAX_SYSTEM_PROMPT_LENGTH = 500;
const MAX_LINKS_COUNT = 5;
const MAX_LINK_LENGTH = 300;
const MAX_TOTAL_SIZE_MB = 200;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Parse JSON payload
        const dataString = formData.get('data') as string;
        const { assistantName, links, systemPrompt } = JSON.parse(dataString);

        const files = formData.getAll('files') as File[];

        // --- Immediate validation ---
        if (!assistantName || !links || !systemPrompt) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        if (typeof assistantName !== "string" || typeof systemPrompt !== "string" || !Array.isArray(links)) {
            return NextResponse.json({ error: "Invalid data types" }, { status: 400 });
        }

        if (assistantName.length > MAX_ASSISTANT_NAME_LENGTH || systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH || links.length > MAX_LINKS_COUNT) {
            return NextResponse.json({ error: "Data length limits exceeded" }, { status: 400 });
        }

        if (!links.every(link => typeof link === "string" && link.length <= MAX_LINK_LENGTH)) {
            return NextResponse.json({ error: "Invalid links provided" }, { status: 400 });
        }

        const safeTableName = sanitizeTableName(assistantName);

        // Immediately acknowledge success response:
        NextResponse.json({ success: true, message: "Processing started", safeTableName });

        // --- Continue processing in background ---
        processDataInBackground({
            assistantName,
            links,
            systemPrompt,
            files,
            safeTableName
        });

        return NextResponse.json({ success: true, message: "Processing initiated", metadata: { safeTableName } });

    } catch (error) {
        console.error("Error initializing processing:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function processDataInBackground({
    assistantName,
    links,
    systemPrompt,
    files,
    safeTableName,
  }: {
    assistantName: string;
    links: string[];
    systemPrompt: string;
    files: File[];
    safeTableName: string;
  }) {
    try {
        // Ensure assistants table exists
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "assistants" (
                id SERIAL PRIMARY KEY,
                assistant_name TEXT NOT NULL,
                system_prompt TEXT NOT NULL,
                current_chunk INTEGER NOT NULL,
                total_chunks INTEGER NOT NULL,
                task_completed BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `));

        // Create dynamic table for new assistant
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "${safeTableName}" (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB,
                embedding VECTOR(1536)
            );
        `));

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

        let allChunks: { pageContent: string; link: string; }[] = [];

        // Scrape links
        for await (const url of links) {
            const content = await scrapePage(url);
            if (!content) continue;
            const chunks = await splitter.createDocuments([content]);
            chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: url }));
        }

        // Parse files
        let totalSize = 0;
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            totalSize += buffer.length;
            if (totalSize > MAX_TOTAL_SIZE_BYTES) {
                console.warn(`Total file size limit exceeded: ${file.name}`);
                continue;
            }

            const category = getFileCategory(file.type);
            let text = '';
            switch (category) {
                case 'pdf':
                case 'document':
                    text = await parsePdfOrDoc(buffer, file.name);
                    break;
                case 'text':
                    text = await parseTxt(buffer);
                    break;
                case 'images':
                    text = await parseImage(buffer, file.name);
                    break;
                case 'excel':
                    text = await parseExcel(buffer, file.name);
                    break;
                default:
                    continue;
            }
            const chunks = await splitter.createDocuments([text]);
            chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: file.name }));
        }

        // Insert assistant entry
        const [assistantRow] = await db.insert(assistants).values({
            assistantName,
            systemPrompt,
            currentChunk: 0,
            totalChunks: allChunks.length,
            taskCompleted: false,
        }).returning();

        // Embedding and insert chunks
        const BATCH_SIZE = 50;

        for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
            const batch = allChunks.slice(i, i + BATCH_SIZE);
            const embeddings = await Promise.all(
                batch.map(chunk => openAIembeddings.embedQuery(chunk.pageContent))
            );

            const valuesSql = batch.map((chunk, idx) => {
                const embeddingArray = embeddings[idx].map((val: number) => parseFloat(val.toFixed(6)));
                return sql`(${chunk.pageContent}, ${JSON.stringify({
                    chunkIndex: i + idx,
                    totalChunks: allChunks.length,
                    link: chunk.link,
                })}, ${sql.raw(`ARRAY[${embeddingArray.join(",")}]::vector`)})`;
            });

            await db.execute(sql`
                INSERT INTO "${sql.raw(safeTableName)}" (content, metadata, embedding)
                VALUES ${sql.join(valuesSql, sql`, `)}
            `);

            // Update progress
            await db.update(assistants).set({
                currentChunk: Math.min(i + BATCH_SIZE, allChunks.length),
                taskCompleted: i + BATCH_SIZE >= allChunks.length,
            }).where(sql`${assistants.id} = ${assistantRow.id}`);
        }

        console.log(`✅ Processing completed for assistant: ${assistantName}`);

    } catch (error) {
        console.error("Background processing error:", error);
    }
}
