import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { revalidateTag } from "next/cache";

const s3Client = new S3Client({
  region: "eu-north-1",
  endpoint: process.env.ALLAS_ENDPOINT_URL!,
  credentials: {
    accessKeyId: process.env.ALLAS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ALLAS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const allasClient = {
  async listFiles(bucket: string) {
    const command = new ListObjectsV2Command({ Bucket: bucket });
    const response = await s3Client.send(command);
    return response.Contents || [];
  },

  async uploadFile(bucket: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: file.name,
      Body: uint8Array,
      ContentType: file.type,
    });
    await s3Client.send(command);
    revalidateTag("allas-bucket");
  },

  async deleteFile(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3Client.send(command);
    revalidateTag("allas-bucket");
  },

  async downloadFile(bucket: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await s3Client.send(command);
    return response.Body;
  },
};
