// app/api/research/route.ts
import ReflectiveRAG from "@/ai/services/rag/reflectice-RAG";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const API_SECRET = process.env.API_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!API_SECRET) throw new Error("API_SECRET is not set");
if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not set");
if (!SUPABASE_KEY) throw new Error("SUPABASE_KEY is not set");

export async function POST(request: Request) {
  try {
    // Tarkista API avain
    const authHeader = (await headers()).get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey || apiKey !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tarkista sisältötyyppi
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 },
      );
    }

    // Lue ja validoi pyyntö
    const body = await request.json();
    const { query, maxReflections } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 },
      );
    }

    // Luo palvelu ja prosessoi kysely
    const research = new ReflectiveRAG({
      supabaseUrl: SUPABASE_URL as string,
      supabaseKey: SUPABASE_KEY as string,
      maxReflections: maxReflections || 3,
    });

    const result = await research.processQuery(query);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Research API error:", error);

    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 },
    );
  }
}
