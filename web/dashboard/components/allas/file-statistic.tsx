import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "@/lib/utils";
import type { _Object } from "@aws-sdk/client-s3";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface FileStatisticsProps {
  files: _Object[];
}

export default function FileStatistics({ files }: FileStatisticsProps) {
  const fileTypes = files.reduce(
    (acc, file) => {
      const extension = file.Key?.split(".").pop()?.toLowerCase() || "unknown";
      acc[extension] = (acc[extension] || 0) + (file.Size || 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  const data = Object.entries(fileTypes)
    .map(([name, size]) => ({ name, size }))
    .sort((a, b) => b.size - a.size);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const totalSize = files.reduce((acc, file) => acc + (file.Size || 0), 0);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Storage Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Files</span>
              <span className="font-medium">{files.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Storage Used
              </span>
              <span className="font-medium">{formatFileSize(totalSize)}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="size"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatFileSize(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
