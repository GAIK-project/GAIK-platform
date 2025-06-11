import { allasClient } from "@/lib/allasClient";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bucket = searchParams.get("bucket");
  const fileName = searchParams.get("key");

  if (!bucket || !fileName) {
    return new Response("Missing bucket or key", { status: 400 });
  }

  try {
    const stream = await allasClient.downloadFile(bucket, fileName);
    return new Response(stream as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new Response("Download failed", { status: 500 });
  }
}
