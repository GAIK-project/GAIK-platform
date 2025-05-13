"use client";

import { LayoutDashboard } from "lucide-react"; // Using LayoutDashboard as a placeholder logo

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function CompanyLogo({ className }: { className?: string }) {
  const { state } = useSidebar();
  
  return (
    <div className={cn("flex items-center transition-all duration-300", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <LayoutDashboard className="h-5 w-5" />
      </div>
      {state === "expanded" && (
        <span className="ml-3 text-lg font-bold tracking-wider">GAIK</span>
      )}
    </div>
  );
}
