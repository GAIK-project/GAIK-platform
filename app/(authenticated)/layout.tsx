import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { BreadcrumbHeader } from "@/components/sidebar/breadcrumb-header";
import { SidebarRouteHandler } from "@/components/sidebar/sidebar-router-handler";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex w-full h-screen overflow-hidden user-select-none">
        <SidebarRouteHandler />
        <AppSidebar variant="inset" />
        <SidebarInset>
          <BreadcrumbHeader />
          <div className="relative flex-1 overflow-auto">
            {/* <div className="absolute inset-0 bg-dot-black/[0.2]" /> */}
            <div className="relative bg-custom-gradient h-full">{children}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
