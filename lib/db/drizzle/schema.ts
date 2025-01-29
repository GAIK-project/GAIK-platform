// lib/db/drizzle/schema.ts
import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type SearchDocument = Document & { similarity: number };
