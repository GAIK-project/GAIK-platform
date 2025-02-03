import { Database } from "lucide-react";

interface DashboardHeaderProps {
  bucketName: string;
}

export default function DashboardHeader({ bucketName }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold text-gray-900">
              Allas File Manager
            </h1>
          </div>
          <div className="text-sm text-gray-600">
            Bucket: <span className="font-medium">{bucketName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
