"use client";

import type { _Object } from "@aws-sdk/client-s3";
import AllasFileUpload from "./allas-file-upload";
import FileStatistics from "./file-statistic";
interface DashboardHeaderProps {
  bucketName: string;
}

function DashboardHeader({ bucketName }: DashboardHeaderProps) {
  return (
    <div className="space-x-1 flex items-baseline justify-between mb-6 border w-fit rounded-xl bg-white p-3">
      <h1 className="text-2xl font-semibold text-primary">Bucket:</h1>
      <span className="text-xl font-medium text-foreground">{bucketName}</span>
    </div>
  );
}

export default function Dashboard({
  bucketName,
  initialFiles,
}: {
  bucketName: string;
  initialFiles: _Object[];
}) {
  return (
    <div className="min-h-screen bg-page">
      <main className="container mx-auto px-4 py-8">
        <DashboardHeader bucketName={bucketName} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Section - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-border/40 p-6">
              <AllasFileUpload
                bucket={bucketName}
                initialFiles={initialFiles}
              />
            </div>
          </div>

          {/* Statistics Section - Takes up 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-border/40 h-full">
              <FileStatistics files={initialFiles} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
