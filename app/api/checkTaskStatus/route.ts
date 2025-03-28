import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db/drizzle/drizzle';
import { assistants } from '@/lib/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { sanitizeTableName } from "@/app/utils/functions/functions";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { assistantName } = body;

        if (typeof assistantName !== 'string') {
            return NextResponse.json({ error: 'Invalid assistantName' }, { status: 400 });
        }

        // Sanitize input
        const safeAssistantName = sanitizeTableName(assistantName);

        if (!safeAssistantName) {
            return NextResponse.json({ error: 'Invalid assistantName after sanitization' }, { status: 400 });
        }

        // Query the assistant
        const result = await db
            .select()
            .from(assistants)
            .where(eq(assistants.assistantName, safeAssistantName));

        if (result.length === 0) {
            return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
        }

        const assistant = result[0];

        const percentageCompleted = assistant.totalChunks > 0 
            ? Math.floor((assistant.currentChunk / assistant.totalChunks) * 100) 
            : 0;

        return NextResponse.json({
            taskCompleted: assistant.taskCompleted,
            currentChunk: assistant.currentChunk,
            totalChunks: assistant.totalChunks,
            percentageCompleted: percentageCompleted
        });
        
    } catch (error) {
        console.error('Error checking task status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
