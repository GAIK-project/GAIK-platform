import { Organization, UserRole } from "../db/drizzle/schema";
export type LanguageType = "fi" | "en" | "sv";

export type UserData = {
  id: string;
  email: string;
  name: string;
  organization: Organization;
  role: UserRole;
  isActive: boolean;
  avatar?: string | null;
  preferences?: Record<string, unknown>;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreferences = {
  language?: LanguageType;
  notifications?: {
    email?: boolean;
  };
};
