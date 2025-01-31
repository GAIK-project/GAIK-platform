export interface NavItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface RouteConfig {
  path: string;
  title: string;
  icon?: string;
  children?: RouteConfig[];
  hideBreadcrumb?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: "",
    title: "Dashboard",
    icon: "tabler:layout-dashboard",
  },
  {
    path: "chatbot",
    title: "Chatbot",
    icon: "tabler:message-chatbot",
  },
  {
    path: "agents",
    title: "Agents",
    hideBreadcrumb: true,
    icon: "tabler:robot",
    children: [
      { path: "text", title: "Text" },
      { path: "docx", title: "Word-Docs" },
    ],
  },
  {
    path: "file-upload",
    title: "File Upload",
    icon: "tabler:cloud-upload",
  },
  {
    path: "documentation",
    title: "Documentation",
    icon: "tabler:file-text",
  },
  {
    path: "flow",
    title: "React Flow",
    icon: "tabler:user-screen",
  },
  {
    path: "invite-user",
    title: "Invite",
    icon: "tabler:adjustments",
  },
];
// Helper function to get route title by path
export function getRouteTitle(
  path: string,
  routeConfigs: RouteConfig[] = routes
): string | null {
  const normalizedPath = path.toLowerCase();

  function findRouteInfo(configs: RouteConfig[]): RouteConfig | null {
    for (const route of configs) {
      if (route.path.toLowerCase() === normalizedPath) {
        return route;
      }
      if (route.children) {
        const found = findRouteInfo(route.children);
        if (found) return found;
      }
    }
    return null;
  }

  const foundRoute = findRouteInfo(routeConfigs);
  return foundRoute && !foundRoute.hideBreadcrumb ? foundRoute.title : null;
}

// Convert routes to NavMain format
export function getNavMainItems(): NavItem[] {
  return routes.map((route) => ({
    title: route.title,
    url: `/${route.path}`,
    icon: route.icon,
    items: route.children?.map((child) => ({
      title: child.title,
      url: `/${route.path}/${child.path}`,
    })),
  }));
}
