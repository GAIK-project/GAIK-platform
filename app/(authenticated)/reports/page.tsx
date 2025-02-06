"use client";

import IncidentReportForm from "@/components/charts/incident-report-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Globe2,
  LineChartIcon,
  Package2,
  Users2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";

// ----------------------
// Type Definitions & Sample Data
// ----------------------
interface DataPoint {
  revenue: number;
  customers: number;
  date: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface RegionData {
  region: string;
  orders: number;
  percentage: number;
}

const data: DataPoint[] = [
  { revenue: 1200, customers: 800, date: "Jan 22" },
  { revenue: 2100, customers: 1200, date: "Feb 22" },
  { revenue: 1800, customers: 1100, date: "Mar 22" },
  { revenue: 2400, customers: 1500, date: "Apr 22" },
  { revenue: 2800, customers: 1700, date: "May 22" },
];

const recentActivities = [
  "New subscription purchased",
  "Product review submitted",
  "Account settings updated",
];

// ----------------------
// Reusable Components
// ----------------------
const MetricCard = ({ title, value, change, icon }: MetricCardProps) => (
  <Card className="flex flex-row items-center justify-between p-6">
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{change}</span>
    </div>
    <div className="h-6 w-6 text-primary">{icon}</div>
  </Card>
);

// ----------------------
// Main Component
// ----------------------
export default function DashboardV2() {
  const [activeTab, setActiveTab] = useState("overview");

  // Instead of generating random numbers, we use fixed values to ensure consistent markup.
  const regionData: RegionData[] = useMemo(
    () => [
      { region: "North America", orders: 800, percentage: 56 },
      { region: "Europe", orders: 650, percentage: 96 },
      { region: "Asia Pacific", orders: 900, percentage: 75 },
    ],
    [],
  );

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      {/* Header with Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="hidden md:flex items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        {/* Overview Tab Content */}
        <TabsContent value="overview">
          {/* Revenue Overview & Top Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-6 mb-8">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data}>
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--primary))"
                      opacity={0.9}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:col-span-2">
              <MetricCard
                title="Revenue"
                value="$45.2k"
                change="+20.1% from last month"
                icon={<BadgeDollarSign />}
              />
              <MetricCard
                title="Customers"
                value="2,350"
                change="+18% from last month"
                icon={<Users2 />}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Products
                </CardTitle>
                <Package2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+19% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Sales Today
                </CardTitle>
                <LineChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+201 since last hour</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Regional Overview</CardTitle>
                <CardDescription>Top performing regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map(({ region, orders, percentage }) => (
                    <div key={region} className="flex items-center">
                      <Globe2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {region}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="ml-2">{percentage}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {orders} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Growth & Recent Activity */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>Monthly customer acquisition</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <Line
                      type="monotone"
                      strokeWidth={2}
                      dataKey="customers"
                      stroke="hsl(var(--primary))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest customer actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivities.map((activity, i) => (
                    <div key={activity} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i + 1} minute{i !== 0 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab Content */}
        <TabsContent value="analytics">
          <p className="text-lg font-medium">Analytics details go here.</p>
          {/* You can add additional charts or metrics here */}
        </TabsContent>

        {/* Reports Tab Content */}
        <TabsContent value="reports">
          <IncidentReportForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
