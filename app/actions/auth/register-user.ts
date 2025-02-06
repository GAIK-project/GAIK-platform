"use server";

import { db } from "@/lib/db/drizzle/drizzle";
import { getInviteByToken, markInviteAsUsed } from "@/lib/db/drizzle/queries";
import { userProfiles } from "@/lib/db/drizzle/schema";
import { createServerClient } from "@/lib/db/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const SignupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((e) => e.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  token: z.string().min(1, "Invitation token is required"),
});

type State = {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    token?: string[];
  };
  message?: string;
};

export async function registerUser(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  try {
    // Validate inputs and transform email to lowercase
    const validatedFields = SignupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      token: formData.get("token"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password, name, token } = validatedFields.data;
    // email on nyt varmasti lowercase Zod-transformaation ansiosta

    const supabase = await createServerClient();

    // Verify invite
    const invite = await getInviteByToken(token);
    if (!invite) {
      return {
        message: "Invalid or expired invitation",
      };
    }

    // Email comparison (molemmat ovat nyt lowercase)
    if (email !== invite.email.toLowerCase()) {
      return {
        message: `Email does not match the invitation. Please use ${invite.email}`,
      };
    }

    // Create auth user in Supabase with lowercase email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email, // Uses transformed lowercase email
      password,
      options: {
        data: {
          name,
          organization: invite.organization,
          role: "USER",
        },
      },
    });

    if (authError) {
      return {
        message: authError.message,
      };
    }

    if (!authData.user?.id) {
      return {
        message: "Failed to create user account",
      };
    }

    // Create user profile
    await db
      .insert(userProfiles)
      .values({
        id: authData.user.id,
        preferences: {
          language: "fi",
        },
      })
      .returning();

    // Mark invite as used
    const marked = await markInviteAsUsed(invite.id);
    if (!marked) {
      console.error("Failed to mark invite as used");
    }
  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect("/sign-in");
}
