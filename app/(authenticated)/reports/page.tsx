"use client";

import IncidentReportForm from "@/components/charts/incident-report-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Globe2,
  LineChartIcon,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

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

const customerGrowthData = [
  { month: "January", growth: 800 },
  { month: "February", growth: 1200 },
  { month: "March", growth: 1100 },
  { month: "April", growth: 1500 },
  { month: "May", growth: 1700 },
  { month: "June", growth: 2000 },
];

// ----------------------
// Chart Configurations
// ----------------------
const revenueChartConfig: ChartConfig = {
  revenue: {
    label: "Monthly Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const customersChartConfig: ChartConfig = {
  growth: {
    label: "Customer Growth",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const radarChartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const activeProductsConfig: ChartConfig = {
  products: {
    label: "Active Products",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const radarChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

// ----------------------
// Reusable Components
// ----------------------
const MetricCard = ({ title, value, change, icon }: MetricCardProps) => (
  <Card className="flex flex-row items-center justify-between p-6">
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-primary">{title}</span>
      <span className="text-2xl font-bold text-pri">{value}</span>
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
    []
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
                <CardDescription>Monthly revenue analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={revenueChartConfig}
                  className="min-h-[350px] w-full"
                >
                  <BarChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelKey="revenue"
                          formatter={(value) => `$${value}`}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ChartContainer>
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
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Products
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={activeProductsConfig}
                  className="mx-auto aspect-square h-[140px]"
                >
                  <RadialBarChart
                    data={[{ products: 85 }]}
                    startAngle={0}
                    endAngle={250}
                    innerRadius={60}
                    outerRadius={90}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[70, 60]}
                    />
                    <RadialBar
                      dataKey="products"
                      // Replace with a simpler fill that matches the key in config
                      fill="hsl(var(--chart-2))"
                      background
                      cornerRadius={8}
                    />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-xl font-bold"
                                >
                                  12,234
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 18}
                                  className="fill-muted-foreground text-xs"
                                >
                                  products
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-1 text-sm pt-2">
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+19% from last month</span>
                </div>
              </CardFooter>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Sales Today</h3>
                <LineChartIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold">$8,573</div>
                  <div className="flex items-center justify-center text-xs text-green-500 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+$1,201 since last hour</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mt-2">
                  <BadgeDollarSign className="h-7 w-7 text-blue-500" />
                </div>
              </div>
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
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={customersChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={customerGrowthData}
                    margin={{
                      top: 20,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="growth" fill="hsl(var(--chart-1))" radius={8}>
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader className="items-center pb-4">
                <CardTitle>Visitor Analytics</CardTitle>
                <CardDescription>
                  Showing total visitors for the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <ChartContainer
                  config={radarChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadarChart data={radarChartData}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <PolarAngleAxis dataKey="month" />
                    <PolarGrid />
                    <Radar
                      dataKey="desktop"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      stroke="hsl(var(--chart-1))"
                    />
                    <Radar
                      dataKey="mobile"
                      fill="hsl(var(--chart-2))"
                      stroke="hsl(var(--chart-2))"
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  January - June 2024
                </div>
              </CardFooter>
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
