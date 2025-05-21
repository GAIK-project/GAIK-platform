"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { createBrowserClient } from "@/lib/db/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
  return true;
}

export function UserDetails({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  return (
    <div className="px-3 py-3 border-t">
      {state === "expanded" ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 rounded-lg shadow-sm">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-sm truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
