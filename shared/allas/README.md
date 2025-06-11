# Allas Package

Shared CSC Allas (S3) utilities for Gaik platform.

## Usage

```typescript
import { getFiles, uploadFile, deleteFile, allasClient } from "@gaik/allas";

// Server actions
const files = await getFiles("bucket-name");
await uploadFile("bucket-name", file);
await deleteFile("bucket-name", "file-key");

// Direct client usage
const files = await allasClient.listFiles("bucket-name");
```
