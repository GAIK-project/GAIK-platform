import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModelSelector } from "./model-selector";

export function ChatHeader({
  modelId,
  onReset,
}: {
  modelId: string;
  onReset: () => void;
  isLoading: boolean;
  isMobile: boolean;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={onReset}
        >
          <Plus className="h-4 w-4" />
        </Button>
        {/* TODO: How to display modelselector on mobile. We have isMobile props already */}
        <ModelSelector selectedModelId={modelId} />
      </div>
    </header>
  );
}
