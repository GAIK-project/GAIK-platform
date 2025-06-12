/**
 * Shared TypeScript types for GAIK monorepo
 * Keep this simple - add common types that are used across multiple apps
 */

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * File types
 */
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Chat types
 */
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  userId?: string;
}

export interface ChatSession {
  id: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * RAG Builder types
 */
export interface RagDocument {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RagDataset {
  id: string;
  name: string;
  description?: string;
  documents: RagDocument[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Common utility types
 */
export type Status = "idle" | "loading" | "success" | "error";

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
