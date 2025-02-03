"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { _Object } from "@aws-sdk/client-s3";
import AllasFileUpload from "./allas-file-upload";
import FileStatistics from "./file-statistic";
import DashboardHeader from "./header";

interface DashboardProps {
  bucketName: string;
  initialFiles: _Object[];
}

export default function Dashboard({
  bucketName,
  initialFiles,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader bucketName={bucketName} />
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <AllasFileUpload bucket={bucketName} initialFiles={initialFiles} />
          </TabsContent>
          <TabsContent value="statistics">
            <FileStatistics files={initialFiles} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
