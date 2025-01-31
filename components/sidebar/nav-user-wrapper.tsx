// components/sidebar/nav-user-wrapper.tsx
import { createBrowserClient } from "@/lib/db/supabase/client";
import { redirect } from "next/navigation";
import { NavUser } from "./nav-user";

export async function NavUserWrapper() {
  const supabase = createBrowserClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("avatar")
    .eq("id", user.id)
    .single();

  return (
    <NavUser
      user={{
        name: user.user_metadata.name || "",
        email: user.email!,
        avatar: profile?.avatar || "",
      }}
    />
  );
}
