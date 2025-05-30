import { BarChart2, Upload } from "lucide-react";

interface DashboardSidebarProps {
  currentView: "upload" | "statistics";
  setCurrentView: (view: "upload" | "statistics") => void;
}

export default function DashboardSidebar({
  currentView,
  setCurrentView,
}: DashboardSidebarProps) {
  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <a
          href="#"
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            currentView === "upload"
              ? "bg-blue-500 hover:bg-blue-600"
              : "hover:bg-gray-700"
          }`}
          onClick={() => setCurrentView("upload")}
        >
          <Upload className="inline-block mr-2 h-5 w-5" />
          File Upload
        </a>
        <a
          href="#"
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            currentView === "statistics"
              ? "bg-blue-500 hover:bg-blue-600"
              : "hover:bg-gray-700"
          }`}
          onClick={() => setCurrentView("statistics")}
        >
          <BarChart2 className="inline-block mr-2 h-5 w-5" />
          File Statistics
        </a>
      </nav>
    </div>
  );
}
