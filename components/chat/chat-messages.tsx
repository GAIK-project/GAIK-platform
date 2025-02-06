import { cn } from "@/lib/utils";
import type { Message as MessageType } from "ai";
import { PaperclipIcon } from "lucide-react";
import { Message, ThinkingMessage } from "./message";

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
}

const createTestMessages = (count: number): MessageType[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    role: i % 2 === 0 ? "user" : "assistant",
    content: `Test message ${i + 1}`,
  }));
};

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const isLastMessageFromUser =
    messages.length > 0 && messages[messages.length - 1].role === "user";
  const showThinkingMessage = isLoading && isLastMessageFromUser;

  const testMessages = createTestMessages(15); // TODO: Remove when not needed anymore

  return (
    <div
      className={cn(
        "flex flex-col",
        "w-full h-full",
        "overflow-y-auto",
        "p-4",
        "space-y-4",
        "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
        "scrollbar-track-transparent",
        messages.length === 0 ? "justify-center" : "justify-start",
      )}
    >
      <>
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={message.content}
            isLoading={false}
          >
            {message.content.startsWith("Attached file:") && (
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                {message.content.replace("Attached file: ", "")}
              </div>
            )}
          </Message>
        ))}
        {showThinkingMessage && <ThinkingMessage />}
      </>
    </div>
  );
}
