import { Attachment } from "ai";
import { PaperclipIcon, X } from "lucide-react";
import { Button } from "../ui/button";

interface AttachmentListProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
}

export function AttachmentList({ attachments, onRemove }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
        >
          <PaperclipIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
            {attachment.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      ))}
    </div>
  );
}
