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

const MAX_ASSISTANT_NAME_LENGTH = 30;
const MAX_SYSTEM_PROMPT_LENGTH = 500;
const MAX_LINKS_COUNT = 5;
const MAX_LINK_LENGTH = 300;
const MAX_TOTAL_SIZE_BYTES = 200 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const dataString = formData.get('data') as string;
        const { assistantName, links, systemPrompt, owner } = JSON.parse(dataString);

        console.log("received request: ", `AssistantName: ${assistantName}`);

        const files = formData.getAll('files') as File[];

        //Validations
        if (!assistantName || !systemPrompt || (!links || files.length === 0)) {
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
    files?: File[];
    safeTableName: string;
    owner?: string;
}) {
    try {
        console.log("Initiating rag creation...");
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "assistants" (
                id SERIAL PRIMARY KEY,
                assistant_name TEXT NOT NULL,
                owner TEXT,
                original_sources JSONB,
                errors JSONB DEFAULT '[]',
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
        const errors: { type: string; details: string }[] = [];

        if(links[0]){
            for await (const url of links) {
                const content = await scrapePage(url);
                if (!content) {
                    errors.push({ type: "scrape", details: `Failed to scrape URL: ${url}` });
                    continue;
                }
                const sourceId = uuidv4();
                originalSources.push({ filename: url, uniqueId: sourceId });
                const chunks = await splitter.createDocuments([content]);
                chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: url, sourceId }));
            }
        }
        
        if(files){
            let totalSize = 0;
            for (const file of files) {
                const buffer = Buffer.from(await file.arrayBuffer());
                totalSize += buffer.length;
                if (totalSize > MAX_TOTAL_SIZE_BYTES) {
                    errors.push({ type: "sizeLimit", details: `File exceeds total size limit: ${file.name}` });
                    continue;
                }
    
                const category = getFileCategory(file.type);
                const sourceId = uuidv4();
                const sanitizedFileName = sanitizeTableName(file.name);
    
                if (!category) {
                    errors.push({ type: "unsupportedFile", details: `Unsupported file type (${file.type}) for file: ${file.name}` });
                    continue;
                }
    
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
                        errors.push({ type: "unknownCategory", details: `Unknown category (${category}) for file: ${file.name}` });
                        continue;
                }
    
                const chunks = await splitter.createDocuments([text]);
                chunks.forEach(chunk => allChunks.push({ pageContent: chunk.pageContent, link: sanitizedFileName, sourceId }));
            }
        }
        

        owner = owner ? owner : "jaakko";
        const [assistantRow] = await db.insert(assistants).values({
            assistantName,
            owner,
            originalSources,
            errors,
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
        await db.update(assistants).set({
            errors: sql.raw(`errors || ${JSON.stringify([{ type: "processingError", details: String(error) }])}`)
        }).where(sql`${assistants.assistantName} = ${assistantName}`);
    }
}
