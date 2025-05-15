"use client";

import Image from "next/image";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function CompanyLogo({ className }: { className?: string }) {
  const { state } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-start justify-start px-1 mx-0 transition-all duration-300 w-full",
        className
      )}
    >
      {state === "expanded" ? (
        <div className="w-full flex justify-start">
          <div
            className="relative bg-white rounded-lg p-2 w-full h-32 flex items-center"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <Image
              src="/logos/SVG/gaik_logo_medium.svg"
              alt="GAIK Logo"
              priority
              fill
              className="object-contain object-left w-full h-full"
              style={{ marginLeft: 0 }}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-start">
          <div
            className="relative bg-white rounded-lg w-10 h-10 flex items-center justify-"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <Image
              src="/logos/SVG/gaik-logo-letter-only.png"
              alt="GAIK Icon"
              fill
              priority
              className="object-contain"
              style={{ marginLeft: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
