"use client";

import { deleteFile, uploadFile } from "@/app/actions/allas";
import { cn, formatFileSize } from "@/lib/utils";
import type { _Object } from "@aws-sdk/client-s3";
import { Download, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useOptimistic, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { getFileIcon } from "../get-file-icon";

interface AllasFileUploadProps {
  bucket: string;
  initialFiles: _Object[];
}

type OptimisticAction =
  | { type: "delete"; fileKey: string }
  | { type: "upload"; file: _Object }
  | { type: "revert"; file: _Object };

export default function AllasFileUpload({
  bucket,
  initialFiles,
}: AllasFileUploadProps) {
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(
    new Set()
  );
  const [dragActive, setDragActive] = useState(false);
  const [, startTransition] = useTransition();

  const [optimisticFiles, addOptimisticAction] = useOptimistic<
    _Object[],
    OptimisticAction
  >(initialFiles, (state, action) => {
    switch (action.type) {
      case "delete":
        return state.filter((file) => file.Key !== action.fileKey);
      case "upload":
        return [...state, action.file];
      case "revert":
        return state
          .filter((file) => file.Key !== action.file.Key)
          .concat(action.file);
      default:
        return state;
    }
  });

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExists = optimisticFiles.some(
        (existingFile) => existingFile.Key === file.name
      );

      if (fileExists) {
        toast.error(
          "File with same name already exists.\nPlease rename the file before uploading.",
          { duration: 7000 }
        );
        return;
      }

      const optimisticFile: _Object = {
        Key: file.name,
        Size: file.size,
        LastModified: new Date(),
      };

      setProcessingFiles((prev) => new Set(prev).add(file.name));

      startTransition(() => {
        addOptimisticAction({ type: "upload", file: optimisticFile });
      });

      try {
        await uploadFile(bucket, file);
        toast.success("Uploaded", { duration: 4000 });
      } catch {
        toast.error("Upload failed", { duration: 4000 });
        startTransition(() => {
          addOptimisticAction({ type: "delete", fileKey: file.name });
        });
      } finally {
        setProcessingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(file.name);
          return newSet;
        });
      }
    },
    [bucket, addOptimisticAction, optimisticFiles]
  );

  const handleDelete = useCallback(
    async (key: string) => {
      const fileToDelete = optimisticFiles.find((f) => f.Key === key);
      if (!fileToDelete) return;
      toast.success(`Deleted`, { duration: 4000 });
      startTransition(() => {
        setProcessingFiles((prev) => new Set(prev).add(key));
        addOptimisticAction({ type: "delete", fileKey: key });
      });

      try {
        await deleteFile(bucket, key);
      } catch (err) {
        toast.error(
          `Delete failed: ${err instanceof Error ? err.message : String(err)}`
        );
        startTransition(() => {
          addOptimisticAction({ type: "revert", file: fileToDelete });
        });
      } finally {
        startTransition(() => {
          setProcessingFiles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(key);
            return newSet;
          });
        });
      }
    },
    [bucket, optimisticFiles, addOptimisticAction]
  );

  const handleDownload = useCallback(
    async (key: string) => {
      try {
        const link = document.createElement("a");
        link.href = `/api/allas/download?bucket=${bucket}&key=${key}`;
        link.setAttribute("download", key);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        toast.error("Download failed", { duration: 4000 });
      }
    },
    [bucket]
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <label
          className={cn(
            "relative flex flex-col items-center px-4 py-8 bg-white rounded-lg",
            "border-2 border-dashed transition-colors duration-200",
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            "cursor-pointer"
          )}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer.files[0];
            if (file) {
              const event = {
                target: { files: [file] },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleUpload(event);
            }
          }}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Drag and drop your files here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or click to select files
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
          />
        </label>
      </div>

      <div className="space-y-3">
        {optimisticFiles.map((file) => (
          <div
            key={file.Key}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg",
              "bg-white border transition-all duration-200",
              processingFiles.has(file.Key || "")
                ? "border-blue-200 bg-blue-50/70"
                : "border-gray-200 hover:border-gray-300",
              processingFiles.has(file.Key || "") && "animate-smooth-pulse"
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-gray-500">{getFileIcon(file.Key || "")}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.Key}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.Size || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {processingFiles.has(file.Key || "") ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <>
                  <button
                    onClick={() => file.Key && handleDownload(file.Key)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Download file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => file.Key && handleDelete(file.Key)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    disabled={processingFiles.has(file.Key || "")}
                    title="Delete file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {optimisticFiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No files uploaded yet
          </div>
        )}
      </div>
    </div>
  );
}
