import Dashboard from "@/components/allas/dashboard";
import { LoadingDashboard } from "@/components/loading";
import { allasClient } from "@/lib/allasClient";
import React, { Suspense } from "react";

async function getFiles(bucket: string) {
  try {
    const files = !bucket ? [] : await allasClient.listFiles(bucket);
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export default async function Page() {
  const bucketName = process.env.ALLAS_BUCKET_NAME || "";
  const files = await getFiles(bucketName);

  return (
    <Suspense fallback={<LoadingDashboard />}>
      <Dashboard bucketName={bucketName} initialFiles={files} />
    </Suspense>
  );
}
