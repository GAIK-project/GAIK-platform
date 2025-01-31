"use server";

import { createServerClient } from "@/lib/db/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validointiskeema
const LoginSchema = z.object({
  email: z.string().email("Virheellinen sähköpostiosoite"),
  password: z.string().min(6, "Salasanan tulee olla vähintään 6 merkkiä pitkä"),
});

type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function loginUser(
  prevState: State | undefined,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    if (error) {
      return {
        message:
          error.message === "Invalid login credentials"
            ? "Invalid email or password"
            : "Login failed. Please try again.",
      };
    }

    // Check if we got a session
    if (!data.session) {
      return {
        message: "Login failed. No session.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "Server error. Please try again later.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/");
}
