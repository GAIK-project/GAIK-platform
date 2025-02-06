// lib/db/drizzle/queries.ts
import { UserData } from "@/lib/types/user";
import { and, eq, gt } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { createServerClient } from "../supabase/server";
import { db } from "./drizzle";
import { Invite, Organization, invites, userProfiles } from "./schema";

export async function getInviteByToken(token: string): Promise<Invite | null> {
  const invite = await db.query.invites.findFirst({
    where: and(
      eq(invites.token, token),
      eq(invites.used, false),
      gt(invites.expiresAt, new Date()),
    ),
  });

  return invite || null;
}

export async function markInviteAsUsed(inviteId: string): Promise<boolean> {
  try {
    const [updatedInvite] = await db
      .update(invites)
      .set({ used: true })
      .where(eq(invites.id, inviteId))
      .returning();

    return !!updatedInvite;
  } catch (error) {
    console.error("Error marking invite as used:", error);
    return false;
  }
}

export async function getUserData(): Promise<UserData | null> {
  // Get all dynamic data first
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    return null;
  }

  // Pass the data to cached function for transformation
  return getCachedUserData(user, profile);
}

async function getCachedUserData(
  user: any,
  profile: any,
): Promise<UserData | null> {
  "use cache";
  cacheTag("user-profile");

  try {
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name,
      organization: user.user_metadata.organization,
      role: user.user_metadata.role,
      isActive: true,
      avatar: profile.avatar,
      preferences: profile.preferences,
      lastLoginAt: profile.lastLoginAt,
      createdAt: new Date(user.created_at),
      updatedAt: profile.updatedAt,
    };
  } catch (error) {
    console.error("Error in getCachedUserData:", error);
    return null;
  }
}

export async function validateInvite(
  email: string,
  organization: Organization,
): Promise<Invite | null> {
  const existingInvite = await db.query.invites.findFirst({
    where: and(
      eq(invites.email, email.toLowerCase()),
      eq(invites.organization, organization),
      eq(invites.used, false),
      gt(invites.expiresAt, new Date()),
    ),
  });

  return existingInvite || null;
}

// Utility type for profile updates
type UserProfileUpdate = Partial<{
  avatar: string | null;
  preferences: Record<string, unknown>;
  lastLoginAt: Date | null;
}>;

export async function updateUserProfile(
  userId: string,
  data: UserProfileUpdate,
) {
  try {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, userId))
      .returning();

    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}
