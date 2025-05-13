"use server";

import { allasClient } from "@/lib/allasClient";

// For debugging purposes, you can uncomment the sleep function to simulate a delay
// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getFiles(bucket: string) {
  try {
    return await allasClient.listFiles(bucket);
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export async function uploadFile(bucket: string, file: File) {
  try {
    await allasClient.uploadFile(bucket, file);
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Upload failed");
  }
}

export async function deleteFile(bucket: string, key: string) {
  try {
    await allasClient.deleteFile(bucket, key);
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Delete failed");
  }
}
