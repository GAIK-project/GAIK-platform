"use server";

import { sendEmail } from "@/emails";
import { InviteEmail } from "@/emails/invite-email";
import { db } from "@/lib/db/drizzle/drizzle";
import { validateInvite } from "@/lib/db/drizzle/queries";
import {
  invites,
  Organization,
  organizationEnum,
} from "@/lib/db/drizzle/schema";
import { createServerClient } from "@/lib/db/supabase/server";
import { nanoid } from "nanoid";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  organization: z.enum(organizationEnum.enumValues, {
    errorMap: () => ({ message: "Invalid organization" }),
  }),
});

type State = {
  errors?: {
    email?: string[];
    organization?: string[];
  };
  message?: string;
  success?: boolean;
  pending?: boolean;
};

export async function createInvite(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  try {
    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const isAdmin = user.user_metadata?.role === "ADMIN";
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized. Only administrators can send invitations.",
      };
    }

    // Validate input
    const validatedFields = InviteSchema.safeParse({
      email: formData.get("email"),
      organization: formData.get("organization"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, organization } = validatedFields.data;

    // Check for existing invite using the query function
    const existingInvite = await validateInvite(
      email,
      organization as Organization,
    );
    if (existingInvite) {
      return {
        success: false,
        message:
          "An active invitation already exists for this email and organization",
      };
    }

    // Create new invite
    const token = nanoid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [newInvite] = await db
      .insert(invites)
      .values({
        email: email.toLowerCase(),
        token,
        organization: organization as Organization,
        createdById: user.id,
        expiresAt,
        used: false,
      })
      .returning();

    if (!newInvite) {
      throw new Error("Failed to create invitation");
    }

    // Send invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Invitation to join platform",
      react: InviteEmail({
        inviteUrl,
        organizationName: organization,
      }) as React.ReactElement,
    });

    return {
      success: true,
      message: "Invitation sent successfully!",
    };
  } catch (error) {
    console.error("Failed to create invite:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to send invitation",
    };
  }
}
