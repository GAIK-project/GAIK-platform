import { Model } from "@/ai/custom-model-names";
import useStore from "@/app/utils/store/useStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomModelSelector } from "./custom-model-selector";
import { ModelSelector } from "./model-selector";

interface ChatHeaderProps {
  modelId: string;
  onReset: () => void;
  isLoading: boolean;
  isMobile?: boolean;
  customModelId: string;
  customModels: Model[];
}

export function ChatHeader({
  modelId,
  onReset,
  isLoading,
  isMobile = false,
  customModelId,
  customModels,
}: ChatHeaderProps) {
  const { baseModel } = useStore();
  const showCustomModel =
    baseModel === "hyde-rag" || baseModel === "multi-stage-rag";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2">
      <div
        className={`flex items-center gap-2 ${isMobile ? "flex-col items-start" : "flex-row"}`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={onReset}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Model selector section */}
          <div
            className={`flex ${isMobile ? "flex-col items-start" : "items-center"} gap-2`}
          >
            <p className="text-lg">AI system: </p>
            <ModelSelector selectedModelId={modelId} />
          </div>
        </div>

        {/* Custom model selector */}
        {showCustomModel && (
          <div
            className={`flex ${isMobile ? "flex-col items-start" : "items-center"} gap-2 ${isMobile ? "mt-2" : ""}`}
          >
            <p className="text-lg">Custom dataset: </p>
            <CustomModelSelector
              selectedModelId={customModelId}
              models={customModels}
            />
          </div>
        )}
      </div>
    </header>
  );
}
