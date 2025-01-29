"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getRouteTitle } from "@/lib/config/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbItem {
  title: string;
  path: string;
  isLast: boolean;
}

export function BreadcrumbHeader() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return (
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Home", path: "/", isLast: false },
    ...(pathSegments
      .map((segment, index, array) => {
        const path = `/${array.slice(0, index + 1).join("/")}`;
        const isLast = index === array.length - 1;
        const title = getRouteTitle(segment);

        // Skip segments that are hidden
        if (!title) return null;

        return {
          title,
          path,
          isLast,
        };
      })
      .filter((item) => item !== null) as BreadcrumbItem[]),
  ];

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumb.path}>{breadcrumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
