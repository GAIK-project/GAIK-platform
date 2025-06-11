import { UserPreferences } from "@/lib/types/user";
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  vector,
  integer,
} from "drizzle-orm/pg-core";

export const organizationEnum = pgEnum("organization_type", [
  "HAAGA_HELIA",
  "GAIK_COMPANIES",
] as const);

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"] as const);

//table to store all metadata of different assistants from ragbuilder
export const assistants = pgTable("assistants", {
  id: serial("id").primaryKey(),
  assistantName: text("assistant_name").notNull(),
  owner: text("owner").notNull(),
  originalSources: jsonb("original_sources"),
  errors: jsonb("errors"),
  systemPrompt: text("system_prompt").notNull(),
  currentChunk: integer("current_chunk").notNull(),
  totalChunks: integer("total_chunks").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  taskCompleted: boolean("task_completed").notNull().default(false),
});
//need to add to assistants table: owner, files, fileids and bring them on in ragbuilder process

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey(), // References auth.users.id
  avatar: text("avatar"),
  role: userRoleEnum("role").default("USER").notNull(),
  organization: organizationEnum("organization")
    .default("HAAGA_HELIA")
    .notNull(),
  lastLoginAt: timestamp("last_login_at"),
  preferences: jsonb("preferences")
    .$type<UserPreferences>()
    .default({})
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Invites table
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  organization: organizationEnum("organization").notNull(),
  createdById: uuid("created_by_id").references(() => userProfiles.id),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Type definitions
export type Organization = (typeof organizationEnum.enumValues)[number];
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type UserProfile = typeof userProfiles.$inferSelect;

export type Invite = typeof invites.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type SearchDocument = Document & { similarity: number };
