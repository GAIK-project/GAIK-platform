'use server'

import { createBrowserClient } from '@/lib/db/supabase/client';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const supabase = createBrowserClient();

export async function searchDocuments(query: string, limit = 5) {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });

  const { data, error } = await supabase.rpc('match_documents_ragbuilder', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
  });

  if (error) {
    console.error('Error in searchDocuments:', error);
    throw error;
  }

  return data as Array<{
    id: number;
    content: string;
    metadata: Record<string, any>;
    similarity: number;
  }>;
}
