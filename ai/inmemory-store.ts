// lib/inmemory-store.ts
declare global {
  var __inMemoryFS: Map<string, string> | undefined;
}

// Jos globaalia ei ole, luodaan
if (!global.__inMemoryFS) {
  global.__inMemoryFS = new Map();
}

export const inMemoryFS = global.__inMemoryFS;
