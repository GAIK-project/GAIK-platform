import { Model } from "@/ai/custom-model-names";
import { saveCustomModel } from "@/app/(authenticated)/chatbot/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronDown } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import useStore from "@/app/utils/store/useStore";

interface ModelSelectorProps {
  selectedModelId: string;
  models: Model[];
  className?: string;
}

export function CustomModelSelector({
  selectedModelId,
  models,
  className,
}: ModelSelectorProps) {
  const { setCustomModel } = useStore();

  const selectedModel = models.find((model) => model.id === selectedModelId);

  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[180px] md:px-2 md:h-[34px] justify-between",
            className,
          )}
        >
          {selectedModel?.label || "Select AI Model"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => {
              startTransition(() => {
                setOptimisticModelId(model.id);
                setCustomModel(model.id);
                saveCustomModel(model.id);
              });
            }}
            className="flex flex-row justify-between items-center gap-4"
            data-active={model.id === optimisticModelId}
          >
            <div className="flex flex-col gap-1 items-start">
              <span>{model.label}</span>
              {model.description && (
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              )}
            </div>
            {selectedModelId === model.id && (
              <CheckCircle className="h-4 w-4 text-foreground " />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
