type ReportData = {
  date: string;
  revenue: number;
  subscription: number;
  products: number;
  activeUsers: number;
};

export function generateCSV(data: any[]): string {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => `"${value}"`) // Wrap values in quotes (adjust as needed)
      .join(","),
  );
  return [headers, ...rows].join("\n");
}

export function downloadReport(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
