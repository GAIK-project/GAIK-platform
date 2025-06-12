"use client";

import { useFileAttachments } from "@/lib/hooks/useFileAttachments";
import { cn } from "@/lib/utils";
import type { ChatRequestOptions } from "ai";
import { ArrowUp, Database, PaperclipIcon, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AttachmentList } from "./attachment-list";
import { RAGFiles } from "./rag-files";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSubmit: (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onStop: () => void;
}

export function ChatInput({
  input,
  isLoading,
  onSubmit,
  onChange,
  onStop,
}: ChatInputProps) {
  const {
    attachments,
    fileInputRef,
    handleFileChange,
    removeAttachment,
    clearAttachments,
  } = useFileAttachments();
  const [isRAGFilesVisible, setIsRAGFilesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (
    e?: React.FormEvent | { preventDefault?: () => void },
    options?: ChatRequestOptions,
  ) => {
    e?.preventDefault?.();
    if (!isLoading && (input.trim() || attachments.length > 0)) {
      onSubmit(undefined, options ?? { experimental_attachments: attachments });
      clearAttachments();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, 60),
        400,
      )}px`;
    }
  }, [input]);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors duration-200">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className={cn(
                "min-h-[60px] w-full resize-none",
                "pr-14 pl-4 py-[14px]",
                "border-0",
                "bg-transparent",
                "text-gray-900 dark:text-gray-100",
                "placeholder-gray-400 dark:placeholder-gray-500",
                "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
                "scrollbar-track-transparent",
                "focus:outline-hidden focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                isLoading && "opacity-50",
              )}
              rows={1}
            />
            <div className="absolute right-2 top-[14px]">
              {isLoading ? (
                <Button
                  type="button"
                  onClick={onStop}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Square className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() && attachments.length === 0}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    "bg-blue-500 hover:bg-blue-600",
                    "disabled:bg-gray-300 dark:disabled:bg-gray-600",
                    "transition-colors duration-200",
                  )}
                >
                  <ArrowUp className="h-4 w-4 text-white" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PaperclipIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              // disabled={true}
              onClick={() => setIsRAGFilesVisible((prev) => !prev)}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
            >
              <Database className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </div>
        <AttachmentList attachments={attachments} onRemove={removeAttachment} />
      </form>
      <RAGFiles
        isVisible={isRAGFilesVisible}
        onClose={() => setIsRAGFilesVisible(false)}
      />
    </div>
  );
}
