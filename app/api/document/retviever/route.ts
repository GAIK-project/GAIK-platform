// app/api/inmemory-file/route.ts
import { inMemoryFS } from "@/ai/inmemory-store";
import { NextRequest } from "next/server";

// Oletetaan, että viet inMemoryFS jossain modulissa:
// export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    return new Response("Missing filename", { status: 400 });
  }
  console.log("inMemoryFS:", inMemoryFS);

  console.log("api/inmemory-file/route.ts: filename:", filename);

  // Haetaan muistinvarainen sisältö
  const content = inMemoryFS.get(filename);
  console.log("content:", content);

  if (!content) {
    return new Response("File not found", { status: 404 });
  }

  // Palautetaan raw teksti
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Halutessasi download:
      // "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
