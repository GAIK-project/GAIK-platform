import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import { memo, type ReactNode } from "react";
import { Markdown } from "./markdown";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  children?: ReactNode;
}

function PureMessage({ role, content, isLoading, children }: MessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl items-baseline"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={cn("flex gap-4 w-full", isUser && "flex-row-reverse")}>
        {!isUser && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className={cn("flex flex-col gap-2 ", isUser && "items-end")}>
          <div
            className={cn(
              "flex flex-col gap-4",
              isUser
                ? "bg-primary text-primary-foreground px-3 py-2 rounded-xl"
                : "",
              isLoading && "opacity-50",
            )}
          >
            <Markdown>{content}</Markdown>
          </div>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export const Message = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.content !== nextProps.content) return false;
  if (prevProps.children !== nextProps.children) return false;
  return true;
});

export const ThinkingMessage = () => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
    >
      <div className="flex gap-4 items-center">
        <div className="w-8 h-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 ">
          <span className="text-muted-foreground animate-pulse">
            Thinking...
          </span>
        </div>
      </div>
    </motion.div>
  );
};
