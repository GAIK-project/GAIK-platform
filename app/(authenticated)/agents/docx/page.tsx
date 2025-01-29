"use client";

import { FormEvent, useRef, useState } from "react";

export default function DocumentEditPage() {
  const [file, setFile] = useState<File | null>(null);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);

  // Käytetään useRef viittaamaan file input elementtiin
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("instruction", instruction);

      const res = await fetch("/api/document/docx-edit", {
        method: "POST",
        body: formData,
      });
      // const res = await fetch("/api/llms/claude", {
      //   method: "POST",
      //   body: formData,
      // });

      if (!res.ok) {
        throw new Error("Server error");
      }

      // const blob = await res.blob();
      // const url = URL.createObjectURL(blob);

      // // Lataa tiedosto
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = "edited_document.docx";
      // document.body.appendChild(link);
      // link.click();
      // link.remove();

      // // Siivoa URL
      // URL.revokeObjectURL(url);

      // Tyhjennä lomake onnistuneen lähetyksen jälkeen
      setFile(null);
      setInstruction("");

      // Tyhjennä file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Document edit error:", err);
      alert("Failed to process document");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Document Editor</h1>
        <p className="text-gray-600">
          Upload a PDF file and get edited document back as Word format (.docx)
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <label className="block mb-2 font-medium">Upload Document</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] ?? null;
              setFile(selectedFile);
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {file && (
            <p className="text-sm mt-2 text-gray-600">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <label className="block mb-2 font-medium">Instructions</label>
          <textarea
            className="w-full p-2 border rounded min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your editing instructions here..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !file}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              loading || !file
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                Processing...
              </span>
            ) : (
              "Convert to Word"
            )}
          </button>

          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setInstruction("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="text-sm text-gray-500 text-center">
        <p>
          The edited document will be downloaded automatically as a Word file.
        </p>
      </div>
    </div>
  );
}
