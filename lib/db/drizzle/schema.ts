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
} from "drizzle-orm/pg-core";

export const organizationEnum = pgEnum("organization_type", [
  "HAAGA_HELIA",
  "GAIK_COMPANIES",
] as const);

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"] as const);

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


// JSON DATA EXAMPLE 
export const contentTypeEnum = pgEnum("content_type", [
  "COURSE",
  "CAMPUS",
  "PROGRAM",
  "SERVICE",
] as const);

// Unified content table
export const haagaHeliaContent = pgTable("haaga_helia_content", {
  id: serial("id").primaryKey(),
  type: contentTypeEnum("type").notNull(),
  title: text("title").notNull(),  // Course title, Campus name, Program name, or Service name
  description: text("description"),
  content: jsonb("content").notNull(), // Structured content specific to each type
  metadata: jsonb("metadata").notNull(), // Additional metadata fields
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type definitions
export type ContentType = (typeof contentTypeEnum.enumValues)[number];
export type HaagaHeliaContent = typeof haagaHeliaContent.$inferSelect;
export type NewHaagaHeliaContent = typeof haagaHeliaContent.$inferInsert;
export type SearchResult = HaagaHeliaContent & { similarity: number };