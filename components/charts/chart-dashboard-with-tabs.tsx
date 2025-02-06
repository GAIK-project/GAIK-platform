import CorporateAnalyticsDashboard from "@/components/charts/corporate-analytics-dashboard";
import DashboardV1 from "@/components/charts/dashboard-v1";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ChartDashBoardWithTabs() {
  return (
    <div className="p-4">
      <Tabs defaultValue="dashboardV1" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboardV1">Dashboard V1</TabsTrigger>
          <TabsTrigger value="dashboardV2">Dashboard V2</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboardV1">
          <DashboardV1 />
        </TabsContent>
        <TabsContent value="dashboardV2">
          <CorporateAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
