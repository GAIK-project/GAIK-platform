"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcription: string;
  onConfirm: () => void;
  onEdit: (text: string) => void;
}

export function TranscriptionModal({
  isOpen,
  onClose,
  transcription,
  onConfirm,
  onEdit,
}: TranscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Transcription</DialogTitle>
          <DialogDescription>
            Review and edit the transcribed text before submitting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={transcription}
            onChange={(e) => onEdit(e.target.value)}
            rows={8}
            className="resize-none"
            placeholder="Transcribed text will appear here..."
          />
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm & Use
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
