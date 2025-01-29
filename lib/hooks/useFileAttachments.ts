import { Attachment } from "ai";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const FileValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File should be less than 5MB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

export const useFileAttachments = (maxAttachments = 3) => {
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];

      if (attachments.length >= maxAttachments) {
        toast.error(`Voit valita enintään ${maxAttachments} kuvaa kerralla`);
        return;
      }

      for (const file of files) {
        const validation = FileValidationSchema.safeParse({ file });
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          continue;
        }
        validFiles.push(file);
      }

      const newAttachments = await Promise.all(
        validFiles.map(async (file) => {
          return new Promise<Attachment>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                contentType: file.type,
                url: reader.result as string,
              });
            };
            reader.readAsDataURL(file);
          });
        }),
      );

      setAttachments((prev) => [...prev, ...newAttachments]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearAttachments = () => {
    attachments.forEach((attachment) => {
      if (attachment.url.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.url);
      }
    });
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    attachments,
    fileInputRef,
    handleFileChange,
    removeAttachment,
    clearAttachments,
  };
};
