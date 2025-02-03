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
    <Card>
      <CardHeader>
        <CardTitle>File Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Total Storage Used:</strong> {formatFileSize(totalSize)}
        </p>
        <p>
          <strong>Total files:</strong> {files.length}
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="size"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
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
      </CardContent>
    </Card>
  );
}
