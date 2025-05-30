import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function processPdfFile(file: File) {
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Create a Blob from ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: file.type });

  // Load PDF. Split into pages by default
  const loader = new PDFLoader(blob);
  const docs = await loader.load();
  console.log("docs", docs);

  // Extract text and basic metadata
  const text = docs
    .map((doc: { pageContent: string }) => doc.pageContent)
    .join("\n");
  const metadata = {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    pageCount: docs.length,
    createdAt: new Date().toISOString(),
  };

  return { text, metadata };
}
