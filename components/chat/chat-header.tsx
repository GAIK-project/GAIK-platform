import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModelSelector } from "./model-selector";
import { CustomModelSelector } from "./custom-model-selector";
import { Model } from "@/ai/custom-model-names";
import { models } from "@/ai/model-names";
import useStore from "@/app/utils/store/useStore";

export function ChatHeader({
  modelId,
  onReset,
  isMobile,
  customModelId,
  customModels
}: {
  modelId: string;
  onReset: () => void;
  isLoading: boolean;
  isMobile: boolean;
  customModelId: string;
  customModels: Model[]
}) {

  const { baseModel } = useStore();

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
        {/* Tähän custom mallin valinta */}
        {
          (baseModel === "hyde-rag" || baseModel === "multi-stage-rag")
          ? 
          <>
            <p className="text-lg">Custom model: </p>
            <CustomModelSelector selectedModelId={customModelId} models={customModels}/>
          </>
          : null
        }

      </div>
    </header>
  );
}
