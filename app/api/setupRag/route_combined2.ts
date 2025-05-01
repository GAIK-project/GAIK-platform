import { openAIembeddings } from '@/ai/middleware/index';
import { db } from '@/lib/db/drizzle/drizzle';
import { assistants } from '@/lib/db/drizzle/schema';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { NextRequest, NextResponse } from 'next/server';
import { scrapePage } from '@/lib/ragbuilder/autoScraper';
import { sql } from 'drizzle-orm';
import { sanitizeTableName } from '@/app/utils/functions/functions';
import { parsePdfOrDoc, parseTxt, parseImage, parseExcel } from '@/lib/parsers/parser';
import { getFileCategory } from '@/lib/middleware/validateFileType';
import { v4 as uuidv4 } from 'uuid';

const MAX_TOTAL_SIZE_BYTES = 200 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const dataString = formData.get('data') as string;
        const { assistantName, links, systemPrompt, owner } = JSON.parse(dataString);

        const files = formData.getAll('files') as File[];

        if (!assistantName || !systemPrompt || (!links && files.length === 0)) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        const safeTableName = sanitizeTableName(assistantName);

        NextResponse.json({ success: true, message: "Processing started", safeTableName });

        processDataInBackground({
            assistantName,
            links,
            systemPrompt,
            files,
            safeTableName,
            owner
        });

        return NextResponse.json({ success: true, message: "Processing initiated", metadata: { safeTableName } });

    } catch (error) {
        console.error("Error initializing processing:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function processDataInBackground({
    assistantName,
    links = [],
    systemPrompt,
    files,
    safeTableName,
    owner,
}: {
    assistantName: string;
    links?: string[];
    systemPrompt: string;
    files: File[];
    safeTableName: string;
    owner?: string;
}) {
    try {
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "assistants" (
                id SERIAL PRIMARY KEY,
                assistant_name TEXT NOT NULL,
                owner TEXT,
                original_sources JSONB,
                system_prompt TEXT NOT NULL,
                current_chunk INTEGER NOT NULL,
                total_chunks INTEGER NOT NULL,
                task_completed BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `));

        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "${safeTableName}" (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB,
                embedding VECTOR(1536)
            );
        `));

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

        type Chunk = { pageContent: string; link: string; sourceId: string };
        const allChunks: Chunk[] = [];
        const originalSources: { filename: string; uniqueId: string }[] = [];

        for await (const url of links) {
            const content = await scrapePage(url);
            if (!content) continue;
            const sourceId = uuidv4();
            originalSources.push({ filename: url, uniqueId: sourceId });
            const chunks = await splitter.createDocuments([content]);
            chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: url, sourceId }));
        }

        let totalSize = 0;
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            totalSize += buffer.length;
            if (totalSize > MAX_TOTAL_SIZE_BYTES) continue;

            const category = getFileCategory(file.type);
            const sourceId = uuidv4();
            const sanitizedFileName = sanitizeTableName(file.name);
            originalSources.push({ filename: sanitizedFileName, uniqueId: sourceId });

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
            chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: sanitizedFileName, sourceId }));
        }
        owner = owner ? owner : "jaakko";
        const [assistantRow] = await db.insert(assistants).values({
            assistantName,
            owner,
            originalSources,
            systemPrompt,
            currentChunk: 0,
            totalChunks: allChunks.length,
            taskCompleted: false,
        }).returning();

        const BATCH_SIZE = 50;

        for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
            const batch = allChunks.slice(i, i + BATCH_SIZE);
            const embeddings = await Promise.all(batch.map(chunk => openAIembeddings.embedQuery(chunk.pageContent)));

            const valuesSql = batch.map((chunk, idx) => sql`(${chunk.pageContent}, ${JSON.stringify({
                chunkIndex: i + idx,
                totalChunks: allChunks.length,
                link: chunk.link,
                sourceId: chunk.sourceId,
            })}, ${sql.raw(`ARRAY[${embeddings[idx].map(val => val.toFixed(6)).join(",")}]::vector`)})`);

            await db.execute(sql`
                INSERT INTO "${sql.raw(safeTableName)}" (content, metadata, embedding)
                VALUES ${sql.join(valuesSql, sql`, `)}
            `);

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