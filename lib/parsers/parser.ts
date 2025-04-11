import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { LlamaParseReader } from 'llamaindex'

const reader = new LlamaParseReader({ resultType: 'markdown' });

const writeTempFile = async (buffer: Buffer, fileName: string): Promise<string> => {
  const tempFilePath = path.join(tmpdir(), `${randomUUID()}-${fileName}`);
  await fs.writeFile(tempFilePath, buffer);
  return tempFilePath;
};

export const parsePdfOrDoc = async (buffer: Buffer, fileName: string): Promise<string> => {
  const tempPath = await writeTempFile(buffer, fileName);
  try {
    const documents = await reader.loadData(tempPath);
    return documents.map(doc => doc.text).join('\n');
  } finally {
    await fs.unlink(tempPath);
  }
};

export const parseTxt = async (buffer: Buffer): Promise<string> => {
  return buffer.toString('utf-8');
};

export const parseImage = async (buffer: Buffer, fileName: string): Promise<string> => {
  const tempPath = await writeTempFile(buffer, fileName);
  try {
    const documents = await reader.loadData(tempPath);
    return documents.map(doc => doc.text).join('\n');
  } finally {
    await fs.unlink(tempPath);
  }
};

export const parseExcel = async (buffer: Buffer, fileName : string): Promise<string> => {
    const tempPath = await writeTempFile(buffer, fileName);
  try {
    const documents = await reader.loadData(tempPath);
    return documents.map(doc => doc.text).join('\n');
  } finally {
    await fs.unlink(tempPath);
  }
};
