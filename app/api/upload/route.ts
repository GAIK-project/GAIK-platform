import { NextRequest, NextResponse } from 'next/server'
import { getFileCategory } from '@/lib/middleware/validateFileType'
import { writeFile } from 'fs/promises'
import { parsePdfOrDoc, parseImage, parseExcel, parseTxt } from '@/lib/parsers/parser'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  const results: string[] = []
  let totalSize = 0;

  const MAX_TOTAL_SIZE_MB = 200; // max total size allowed (in megabytes)
  const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const category = getFileCategory(file.type)
    totalSize += buffer.length;

    if (!category) {
      results.push(`${file.name}: ❌ Unsupported file type: ${file.type}`)
      continue
    }

    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: `❌ Total file size exceeds ${MAX_TOTAL_SIZE_MB}MB.` }),
        { status: 400 }
      );
    }

    switch (category) {
        case 'pdf': {
            const text = await parsePdfOrDoc(buffer, file.name);
            // console.log("text: ", text);
            results.push(`${file.name}: ✅ Parsed, ${text.length} chars`);
            break;
        }
        case 'document': {
            const text = await parsePdfOrDoc(buffer, file.name);
            // console.log("text: ", text);
            results.push(`${file.name}: ✅ Parsed, ${text.length} chars`);
            break;
        }
        case 'text': {
            const text = await parseTxt(buffer);
            // console.log("text: ", text);
            results.push(`${file.name}: ✅ Parsed, ${text.length} chars`);
            break;
        }
        case 'images': {
            const text = await parseImage(buffer, file.name);
            // console.log("text: ", text);
            results.push(`${file.name}: ✅ Image parsed to text (${text.length} chars)`);
            break;
        }
        case 'excel': {
            const text = await parseExcel(buffer, file.name);
            // console.log("text: ", text);
            results.push(`${file.name}: ✅ Excel parsed`);
            break;
        }
      default:
        results.push(`${file.name}: ❌ No matching block`)
    }

    console.log(results);

    // Optional: Save file to disk for testing
    // const filename = `${Date.now()}-${file.name}`
    // const filepath = path.join(process.cwd(), 'uploads', filename)
    // await writeFile(filepath, buffer)
  }

  return NextResponse.json({ status: 'done', results })
}
