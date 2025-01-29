"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { state, setOpen } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.isActive) {
        initialState[item.title] = true;
      }
    });
    return initialState;
  });

  useEffect(() => {
    if (isCollapsed) {
      setOpenMenus({});
    }
  }, [isCollapsed]);

  const handleMenuClick = (e: React.MouseEvent, item: (typeof items)[0]) => {
    if (!item.items?.length) {
      return;
    }

    if (isCollapsed) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
      setOpenMenus((prev) => ({
        ...prev,
        [item.title]: true,
      }));
    } else {
      e.preventDefault();
      setOpenMenus((prev) => ({
        ...prev,
        [item.title]: !prev[item.title],
      }));
    }
  };

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item.url);

          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} passHref legacyBehavior>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={active ? "bg-muted hover:bg-muted" : ""}
                  >
                    <a>
                      {item.icon && (
                        <Icon
                          icon={item.icon}
                          className={clsx(
                            "w-6 h-6",
                            active ? "text-foreground" : "",
                          )}
                        />
                      )}
                      <span
                        className={clsx(
                          active ? "text-foreground font-medium" : "",
                        )}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              open={openMenus[item.title] || false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={(e) => handleMenuClick(e, item)}
                    className={active ? "bg-muted hover:bg-muted" : ""}
                  >
                    {item.icon && (
                      <Icon
                        icon={item.icon}
                        className={clsx(
                          "w-6 h-6",
                          active ? "text-foreground" : "",
                        )}
                      />
                    )}
                    <span
                      className={active ? "text-foreground font-medium" : ""}
                    >
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subActive = isActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              subActive ? "bg-muted hover:bg-muted" : ""
                            }
                          >
                            <Link href={subItem.url}>
                              <span
                                className={
                                  subActive ? "text-foreground font-medium" : ""
                                }
                              >
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
