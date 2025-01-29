"use client";

import { FormEvent, useState } from "react";

/**
 * Yksinkertainen chat-sivu:
 * - Käyttäjä kirjoittaa ohjeet (textarea).
 * - Valinnainen tiedoston lataus (esim. PDF).
 * - Lähetys -> FormData -> /api/llm/claude (POST).
 * - Striimin vastaanotto -> Päivitetään "assistant" roolin viesti.
 */
export default function ChatPage() {
  // Chat-viestit, simppeli local state
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vastaanotetaan serverin striimattu output
  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputText && !file) return;

    setIsLoading(true);

    // 1. Lisätään "user"-viesti local stateen
    const newMessages = [...messages, { role: "user", content: inputText }];
    setMessages(newMessages);

    // 2. Rakennetaan formData
    const formData = new FormData();
    formData.append("messages", JSON.stringify(newMessages));
    if (file) {
      formData.append("file", file);
    }

    try {
      // 3. Lähetetään POST-pyyntö
      const res = await fetch("/api/tools/claude", {
        method: "POST",
        body: formData,
      });
      if (!res.ok || !res.body) {
        setIsLoading(false);
        alert("Error from server");
        return;
      }

      // 4. Luetaan striimi chunkkeina
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
      }

      // 5. Lisätään "assistant"-viesti
      if (assistantContent.trim()) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantContent },
        ]);
      }
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setIsLoading(false);
      setFile(null);
      setInputText("");
    }
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Claude + In-Memory Editor</h1>

      <div className="border border-gray-300 rounded p-3 min-h-[300px] bg-gray-50 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap" }}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex flex-col gap-2">
        <textarea
          placeholder='Esim. "Luo tiedosto /testi.txt" jne.'
          className="border p-2 rounded"
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            PDF or other file
          </label>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
            }}
          />
          {file && (
            <p className="text-sm mt-1">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>
        <a
          className="p-4 border w-fit bg-blue-50 rounded-full "
          href={`/api/document/retviever?filename=teksti.txt`}
          download
        >
          Lataa teksti.txt
        </a>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </main>
  );
}
