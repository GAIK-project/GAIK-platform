"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getNavMainItems } from "@/lib/config/routes";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import * as React from "react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

const data = {
  user: {
    name: "Kass",
    email: "kass@miukumauku.com",
    avatar: "/avatars/cat.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
