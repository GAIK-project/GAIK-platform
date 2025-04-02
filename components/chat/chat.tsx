"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { useScrollToBottom } from "@/lib/hooks/useScrollToBottom";
import { motion } from "motion/react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { Model } from "@/ai/custom-model-names";

const suggestedActions = [
  {
    title: "Who wrote",
    label: "Haaga-Helia's reporting instructions",
    action: "Who wrote Haaga-Helia's reporting instructions",
  },
];

interface ChatProps {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedCustomModel: string;
  customModels: Model[];
}

export function Chat({ id, initialMessages, selectedModelId, selectedCustomModel, customModels }: ChatProps) {
  const router = useRouter();
  const { width } = useWindowSize();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
    setMessages,
  } = useChat({
    id,
    initialMessages,
    api: "/api/chat",
    body: { id, modelId: selectedModelId },
    experimental_throttle: 100,
    onFinish: async () => {
      // Potential chat history saving logic
    },
  });

  const handleSuggestionClick = async (action: any) => {
    await append({
      content: action,
      role: "user",
    });
  };

  const {
    containerRef,
    showScrollButton,
    setIsAutoScrollEnabled,
    scrollToBottom,
    handleScroll,
    scrollOnUpdate,
  } = useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    scrollOnUpdate();
  }, [messages, scrollOnUpdate]);

  function handleReset() {
    setMessages([]);
    router.refresh();
  }

  const hasMessages = messages.length > 0;
  const isMobile = width < 768;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <ChatHeader
        modelId={selectedModelId}
        onReset={handleReset}
        isLoading={isLoading}
        isMobile={isMobile}
        customModelId={selectedCustomModel}
        customModels={customModels}
      />

      {!hasMessages ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-1 flex-col items-center justify-center gap-4 px-4"
        >
          <div className="text-center space-y-3 max-w-md px-4 mx-auto mb-4 mt-20">
            <h2 className="text-2xl font-semibold text-primary">
              What can I help you with?
            </h2>

            {/* Suggested Actions */}
            <div className="flex flex-col gap-2 mt-4">
              {suggestedActions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left"
                  onClick={() => handleSuggestionClick(suggestion.action)}
                >
                  <span className="font-medium">{suggestion.title}</span>{" "}
                  <span className="text-muted-foreground">
                    {suggestion.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xl">
            <ChatInput
              input={input}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              onStop={stop}
            />
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden relative">
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto"
            >
              <div className="max-w-3xl mx-auto py-4 px-4">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </div>
            </div>

            {showScrollButton && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  setIsAutoScrollEnabled(true);
                  scrollToBottom();
                }}
                className="absolute bottom-4 right-4 rounded-full shadow-lg bg-white/80 
                           hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-900"
              >
                <ArrowBigRight className="h-4 w-4 rotate-90" />
              </Button>
            )}
          </div>

          <div className="shrink-0 p-4">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                input={input}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onStop={stop}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
