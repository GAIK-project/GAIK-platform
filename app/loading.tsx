import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );
}
