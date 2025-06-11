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
  roles?: string[];
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
    path: "reports",
    title: "Reports",
    // hideBreadcrumb: true,
    icon: "tabler:chart-bar-popular",
  },
  // {
  //   path: "agents",
  //   title: "Agents",
  //   hideBreadcrumb: true,
  //   icon: "tabler:robot",
  //   children: [
  //     { path: "text", title: "Text" },
  //     { path: "docx", title: "Word-Docs" },
  //   ],
  // },
  {
    path: "file-upload",
    title: "File Upload",
    icon: "tabler:cloud-upload",
  },
  {
    path: "rag-builder",
    title: "RAG Builder",
    icon: "tabler:file-text",
  },
  {
    path: "datasetmanager",
    title: "Dataset manager",
    icon: "tabler:list-check",
  },
  // {
  //   path: "admin/invite-user",
  //   title: "Invite",
  //   icon: "tabler:send",
  //   roles: ["ADMIN"], // Restrict to admin only
  // },
];
// Helper function to get route title by path
export function getRouteTitle(
  path: string,
  routeConfigs: RouteConfig[] = routes,
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
export function getNavMainItems(userRole?: string): NavItem[] {
  function hasAccess(route: RouteConfig): boolean {
    if (!route.roles) return true;
    return userRole ? route.roles.includes(userRole) : false;
  }

  function processRoute(route: RouteConfig): NavItem | null {
    if (!hasAccess(route)) return null;

    const navItem: NavItem = {
      title: route.title,
      url: `/${route.path}`,
      icon: route.icon,
    };

    if (route.children) {
      const childItems = route.children
        .map((child) => ({
          title: child.title,
          url: `${navItem.url}/${child.path}`,
        }))
        .filter(Boolean);

      if (childItems.length > 0) {
        navItem.items = childItems;
      }
    }

    return navItem;
  }

  return routes
    .map(processRoute)
    .filter((item): item is NavItem => item !== null);
}
