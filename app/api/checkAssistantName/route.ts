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
      const safeTableName = sanitizeTableName(assistantName);
  
      if (!safeTableName) {
        return NextResponse.json({ error: 'Invalid assistantName after sanitization' }, { status: 400 });
      }
  
      // Query the database
      const existing = await db
        .select()
        .from(assistants)
        .where(eq(assistants.assistantName, safeTableName));
  
      const isTaken = existing.length > 0;
  
      return NextResponse.json({ isTaken });
    } catch (error) {
      console.error('Error checking assistantName:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
