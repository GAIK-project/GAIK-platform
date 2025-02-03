import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <h2 className="text-xl font-semibold mt-4">Loading Dashboard...</h2>
      </div>
    </div>
  );
}
