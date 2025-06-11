"use client";

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
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

// ──────────────────────────────────────────────────────────────
// Dummy Data for Companies and Charts
// ──────────────────────────────────────────────────────────────

const companies = [
  { key: "acmeAI", name: "Acme AI", revenue: 5000, aiProjects: 10 },
  { key: "brainyInc", name: "Brainy Inc.", revenue: 6000, aiProjects: 8 },
  {
    key: "cyberneticSystems",
    name: "Cybernetic Systems",
    revenue: 4000,
    aiProjects: 12,
  },
  {
    key: "deepLearningCo",
    name: "Deep Learning Co",
    revenue: 7000,
    aiProjects: 15,
  },
  {
    key: "neuralNetworksLtd",
    name: "Neural Networks Ltd.",
    revenue: 5500,
    aiProjects: 9,
  },
];

// Data transformed for charts:
const revenueData = companies.map((company) => ({
  company: company.name,
  revenue: company.revenue,
}));

const aiProjectsData = companies.map((company) => ({
  company: company.name,
  aiProjects: company.aiProjects,
}));

const marketShareData = [
  {
    month: "Jan",
    acmeAI: 28,
    brainyInc: 22,
    cyberneticSystems: 30,
    deepLearningCo: 38,
    neuralNetworksLtd: 25,
  },
  {
    month: "Feb",
    acmeAI: 29,
    brainyInc: 23,
    cyberneticSystems: 31,
    deepLearningCo: 39,
    neuralNetworksLtd: 26,
  },
  {
    month: "Mar",
    acmeAI: 30,
    brainyInc: 24,
    cyberneticSystems: 32,
    deepLearningCo: 40,
    neuralNetworksLtd: 27,
  },
  {
    month: "Apr",
    acmeAI: 31,
    brainyInc: 25,
    cyberneticSystems: 33,
    deepLearningCo: 41,
    neuralNetworksLtd: 28,
  },
  {
    month: "May",
    acmeAI: 32,
    brainyInc: 26,
    cyberneticSystems: 34,
    deepLearningCo: 42,
    neuralNetworksLtd: 29,
  },
];

// Interactive Bar Chart dummy data
const interactiveChartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  // ... more data can be added as needed
];

// Pie Chart dummy data
const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

// ──────────────────────────────────────────────────────────────
// Chart Configuration Objects
// ──────────────────────────────────────────────────────────────

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "#2563eb" },
};

const aiProjectsChartConfig = {
  aiProjects: { label: "AI Projects", color: "#60a5fa" },
};

const marketShareChartConfig = {
  acmeAI: { label: "Acme AI", color: "#2563eb" },
  brainyInc: { label: "Brainy Inc.", color: "#60a5fa" },
  cyberneticSystems: { label: "Cybernetic Systems", color: "#10b981" },
  deepLearningCo: { label: "Deep Learning Co", color: "#f59e0b" },
  neuralNetworksLtd: { label: "Neural Networks Ltd.", color: "#ef4444" },
};

const interactiveChartConfig = {
  views: { label: "Page Views" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

const pieChartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
  safari: { label: "Safari", color: "hsl(var(--chart-2))" },
  firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  edge: { label: "Edge", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
};

// ──────────────────────────────────────────────────────────────
// Chart Card Components
// ──────────────────────────────────────────────────────────────

// Revenue Chart Card
function RevenueChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Revenue</CardTitle>
        <CardDescription>Revenue in USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={revenueChartConfig}
          className="min-h-[250px] w-full"
        >
          <BarChart
            data={revenueData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="company" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// AI Projects Chart Card
function AIProjectsChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Projects</CardTitle>
        <CardDescription>Projects powering the future</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={aiProjectsChartConfig}
          className="min-h-[250px] w-full"
        >
          <BarChart
            data={aiProjectsData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="company" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="aiProjects"
              fill="var(--color-aiProjects)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Market Share Trend Chart Card
function MarketShareTrendChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Share Trend</CardTitle>
        <CardDescription>
          Monthly market share (%) for leading AI companies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={marketShareChartConfig}
          className="min-h-[300px] w-full"
        >
          <LineChart
            data={marketShareData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="acmeAI"
              stroke="var(--color-acmeAI)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="brainyInc"
              stroke="var(--color-brainyInc)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="cyberneticSystems"
              stroke="var(--color-cyberneticSystems)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="deepLearningCo"
              stroke="var(--color-deepLearningCo)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="neuralNetworksLtd"
              stroke="var(--color-neuralNetworksLtd)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Interactive Bar Chart Card
function InteractiveBarChartCard() {
  const [activeChart, setActiveChart] = React.useState<"desktop" | "mobile">(
    "desktop",
  );

  const total = React.useMemo(
    () => ({
      desktop: interactiveChartData.reduce(
        (acc, curr) => acc + curr.desktop,
        0,
      ),
      mobile: interactiveChartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Interactive Bar Chart</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {(["desktop", "mobile"] as const).map((chart) => (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6 transition-colors data-[active=true]:bg-muted/50"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {interactiveChartConfig[chart].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[chart].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={interactiveChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={interactiveChartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Visitors Pie Chart Card
function VisitorsPieChartCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Visitors Breakdown</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pieChartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pieChartData}
              dataKey="visitors"
              label
              nameKey="browser"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────
// Automated Reporting & Analytics Card
// ──────────────────────────────────────────────────────────────

function AutomatedReportCard() {
  // Esikäsitellään dataa simuloimalla reasoning-mallia
  const totalRevenue = companies.reduce(
    (acc, company) => acc + company.revenue,
    0,
  );
  const averageRevenue = totalRevenue / companies.length;
  const totalAiProjects = companies.reduce(
    (acc, company) => acc + company.aiProjects,
    0,
  );
  const averageAiProjects = totalAiProjects / companies.length;

  const topRevenueCompany = companies.reduce((prev, curr) =>
    curr.revenue > prev.revenue ? curr : prev,
  );
  const topAiProjectsCompany = companies.reduce((prev, curr) =>
    curr.aiProjects > prev.aiProjects ? curr : prev,
  );

  // Yksinkertainen reasoning-logiikka suorituskykymittarille
  let performanceInsight = "";
  if (averageRevenue > 6000) {
    performanceInsight = "Overall revenue performance is strong.";
  } else if (averageRevenue > 5000) {
    performanceInsight = "Overall revenue performance is moderate.";
  } else {
    performanceInsight = "Overall revenue performance needs improvement.";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Reporting & Analytics</CardTitle>
        <CardDescription>
          Summary report generated by the reasoning model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()}
          </div>
          <div>
            <strong>Average Revenue:</strong> ${averageRevenue.toFixed(2)}
          </div>
          <div>
            <strong>Total AI Projects:</strong> {totalAiProjects}
          </div>
          <div>
            <strong>Average AI Projects:</strong> {averageAiProjects.toFixed(2)}
          </div>
          <div>
            <strong>Top Revenue Company:</strong> {topRevenueCompany.name} ($
            {topRevenueCompany.revenue.toLocaleString()})
          </div>
          <div>
            <strong>Top AI Projects Company:</strong>{" "}
            {topAiProjectsCompany.name} ({topAiProjectsCompany.aiProjects}{" "}
            projects)
          </div>
          <div>
            <strong>Performance Insight:</strong> {performanceInsight}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Report generated on {new Date().toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────
// Main Dashboard Component
// ──────────────────────────────────────────────────────────────

export default function CorporateAnalyticsDashboard() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Company AI Dashboard
        </h2>
      </div>

      {/* Automated Reporting & Analytics Report */}
      <div className="grid grid-cols-1">
        <AutomatedReportCard />
      </div>

      {/* Top Row: Revenue & AI Projects */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RevenueChartCard />
        <AIProjectsChartCard />
      </div>

      {/* Market Share Trend */}
      <div className="grid grid-cols-1">
        <MarketShareTrendChartCard />
      </div>

      {/* Bottom Row: Interactive Bar Chart & Visitors Pie Chart */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InteractiveBarChartCard />
        <VisitorsPieChartCard />
      </div>
    </div>
  );
}
