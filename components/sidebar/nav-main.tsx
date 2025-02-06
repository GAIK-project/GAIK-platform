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
import type React from "react";
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
  const { state, setOpen, isMobile } = useSidebar();
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
    if (!item.items?.length) return;

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
    <SidebarGroup className="mt-8">
      <SidebarGroupLabel className="text-base text-secondary-foreground mb-2">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const active = isActive(item.url);

          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} passHref legacyBehavior>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={clsx(
                      "h-9 transition-colors relative w-full",
                      "px-3 rounded-md",
                      active && !isCollapsed
                        ? "bg-secondary hover:bg-secondary"
                        : !isCollapsed
                          ? "hover:bg-secondary"
                          : "hover:bg-white",
                    )}
                  >
                    <a className="flex items-center w-full space-x-3">
                      {item.icon && (
                        <div
                          className={clsx(
                            "flex items-center justify-center rounded-md",
                            "transition-all duration-200 ease-in-out",
                            "bg-white shadow-sm p-1.5",
                            active && "border-primary/30 bg-primary/10",
                          )}
                        >
                          <Icon
                            icon={item.icon}
                            className={clsx(
                              "w-5 h-5",
                              "transition-colors duration-200",
                              active ? "text-primary" : "text-muted-foreground",
                              "group-hover:text-primary",
                            )}
                          />
                        </div>
                      )}
                      <span
                        className={clsx(
                          "text-sm whitespace-nowrap",
                          "transition-colors duration-200",
                          active
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                          "group-hover:text-foreground",
                          // Näytetään teksti aina mobiilissa
                          isMobile
                            ? "block"
                            : isCollapsed
                              ? "hidden"
                              : "inline-block",
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
                    className={clsx(
                      "h-9 transition-colors relative w-full",
                      "px-3 rounded-md",
                      active
                        ? "bg-secondary hover:bg-secondary"
                        : "hover:bg-secondary",
                    )}
                  >
                    <div className="flex items-center w-full space-x-3">
                      {item.icon && (
                        <div
                          className={clsx(
                            "flex items-center justify-center rounded-md",
                            "transition-all duration-200 ease-in-out",
                            "bg-white shadow-sm p-1.5",
                            active && "border-primary/30 bg-primary/10",
                          )}
                        >
                          <Icon
                            icon={item.icon}
                            className={clsx(
                              "w-5 h-5",
                              "transition-colors duration-200",
                              active ? "text-primary" : "text-muted-foreground",
                              "group-hover:text-primary",
                            )}
                          />
                        </div>
                      )}
                      <span
                        className={clsx(
                          "text-sm whitespace-nowrap",
                          "transition-colors duration-200",
                          active
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                          "group-hover:text-foreground",
                          isCollapsed ? "hidden" : "inline-block",
                        )}
                      >
                        {item.title}
                      </span>
                      {!isCollapsed && (
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subActive = isActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link href={subItem.url} passHref legacyBehavior>
                            <SidebarMenuSubButton
                              asChild
                              className={clsx(
                                "h-8 px-8 rounded-md transition-colors",
                                subActive
                                  ? "bg-secondary hover:bg-secondary"
                                  : "hover:bg-secondary",
                              )}
                            >
                              <a>
                                <span
                                  className={clsx(
                                    "text-xs whitespace-nowrap",
                                    subActive
                                      ? "font-medium text-foreground"
                                      : "text-muted-foreground",
                                    isMobile
                                      ? "block"
                                      : isCollapsed
                                        ? "hidden"
                                        : "inline-block",
                                  )}
                                >
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </Link>
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
