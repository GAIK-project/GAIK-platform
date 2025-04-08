import { NextRequest, NextResponse } from 'next/server'
import { getFileCategory } from '@/lib/middleware/validateFileType'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  const results: string[] = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const category = getFileCategory(file.type)

    if (!category) {
      results.push(`${file.name}: ❌ Unsupported file type: ${file.type}`)
      continue
    }

    switch (category) {
      case 'pdf':
        // PDF processing logic
        results.push(`${file.name}: ✅ PDF block reached`)
        break
      case 'images':
        // Image processing logic
        results.push(`${file.name}: ✅ Image block reached`)
        break
      case 'excel':
        // Excel processing logic
        results.push(`${file.name}: ✅ Excel block reached`)
        break
      case 'text':
        // Text document processing logic
        results.push(`${file.name}: ✅ Text block reached`)
        break
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
