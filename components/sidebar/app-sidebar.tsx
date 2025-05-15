"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getNavMainItems } from "@/lib/config/routes";
import * as React from "react";
import { CompanyLogo } from "./company-logo";
import { NavMain } from "./nav-main";
import { UserDetails } from "./user-details";

const data = {
  user: {
    name: "Kass",
    email: "kass@miukumauku.com",
    avatar: "/avatars/cat.png",
  }
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData?: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}
export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  const navMainItems = getNavMainItems(userData?.role);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <UserDetails user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
