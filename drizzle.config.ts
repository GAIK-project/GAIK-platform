import "@/lib/db/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/drizzle/schema.ts",
  out: "./lib/db/drizzle/migrations/",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
});
