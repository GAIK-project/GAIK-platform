# Auth Package

Shared authentication utilities for Gaik platform.

## Usage

```typescript
import { loginUser, createServerClient } from "@gaik/auth";

// Server action for login
const result = await loginUser(undefined, formData);

// Create server client
const supabase = await createServerClient();
```
