import AllasFileUpload from "@/components/allas-file-upload";
import { allasClient } from "@/lib/allasClient";

async function getFiles(bucket: string) {
  try {
    const files = await allasClient.listFiles(bucket);
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export default async function Page() {
  const bucketName = "gaik-demo-storage";
  const files = await getFiles(bucketName);

  return (
    <main className="container mx-auto py-8">
      <h1 className="md:text-4xl text-3xl font-bold mb-6 text-center">
        Allas File Upload
      </h1>
      <AllasFileUpload bucket={bucketName} initialFiles={files} />
    </main>
  );
}
