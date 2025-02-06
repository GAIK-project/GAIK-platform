"use client";

import {
  Activity,
  BadgeDollarSign,
  Download,
  Globe,
  Loader2,
  Package,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadReport, generateCSV } from "@/lib/helpers/genera-reports";

// ---- TypeScript Types ----

interface HeaderProps {
  onDownload: () => void;
  isDownloading: boolean;
}

interface ChartData {
  revenue: number;
  subscription: number;
  products: number;
  activeUsers: number;
  date: string;
}

interface ChartsProps {
  data: ChartData[];
}

// ---- Sample Data ----

const data: ChartData[] = [
  {
    revenue: 2200,
    subscription: 1400,
    products: 150,
    activeUsers: 1200,
    date: "Jan 22",
  },
  {
    revenue: 1800,
    subscription: 1700,
    products: 145,
    activeUsers: 1300,
    date: "Feb 22",
  },
  {
    revenue: 2400,
    subscription: 1900,
    products: 165,
    activeUsers: 1400,
    date: "Mar 22",
  },
  {
    revenue: 2700,
    subscription: 2200,
    products: 180,
    activeUsers: 1600,
    date: "Apr 22",
  },
  {
    revenue: 2900,
    subscription: 2500,
    products: 200,
    activeUsers: 1800,
    date: "May 22",
  },
];

const summaryData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    Icon: BadgeDollarSign,
  },
  {
    title: "Subscriptions",
    value: "+2350",
    change: "+180.1% from last month",
    Icon: Users,
  },
  {
    title: "Products",
    value: "+12,234",
    change: "+19% from last month",
    Icon: Package,
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201 since last hour",
    Icon: Activity,
  },
];

// ---- Components ----

/**
 * Header Component
 */
function Header({ onDownload, isDownloading }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <Button onClick={onDownload} disabled={isDownloading}>
        {isDownloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * SummaryCards Component
 */
function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Charts Component – contains the Overview (BarChart) and Recent Sales (LineChart)
 */
function Charts({ data }: ChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <Bar dataKey="revenue" fill="hsl(var(--primary))" opacity={0.9} />
              <Bar
                dataKey="subscription"
                fill="hsl(var(--primary))"
                opacity={0.2}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>You made 265 sales this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * DetailedCards Component – displays Top Products and Global Sales information
 */
function DetailedCards() {
  const regions = ["North America", "Europe", "Asia"];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best selling products this month.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Product {i}</p>
                <p className="text-sm text-muted-foreground">
                  {1000 - i * 100} sales
                </p>
              </div>
              <div className="ml-auto font-medium">
                +${(1000 - i * 100) * 2}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Global Sales</CardTitle>
          <CardDescription>Sales distribution across regions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {regions.map((region) => (
            <div key={region} className="flex items-center">
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{region}</p>
                <p
                  className="text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  {Math.floor(Math.random() * 1000)} orders
                </p>
              </div>
              <div className="ml-auto font-medium" suppressHydrationWarning>
                {Math.floor(Math.random() * 100)}%
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Main Dashboard Component
 */
export default function DashboardV1() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Generate CSV content from data
      const csvContent = generateCSV(data);

      // Create a filename with the current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `dashboard-report-${date}.csv`;

      // Trigger the file download
      downloadReport(filename, csvContent);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6">
      <Header onDownload={handleDownload} isDownloading={isDownloading} />
      <SummaryCards />
      <Charts data={data} />
      <DetailedCards />
    </div>
  );
}
