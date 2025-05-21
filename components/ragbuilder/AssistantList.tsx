"use client";

import styles from "@/app/styles/AssistantList.module.css";
import { createBrowserClient } from "@/lib/db/supabase/client";
import { useEffect, useState } from "react";

const supabase = createBrowserClient();

interface Assistant {
  id: number;
  assistant_name: string;
  system_prompt: string;
  current_chunk: number;
  total_chunks: number;
  created_at: string;
  task_completed: boolean;
  owner: string;
  files: string[];
  fileids: string[];
}

interface Props {
  owner: string;
}

export default function AssistantList({ owner }: Props) {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [editing, setEditing] = useState<Record<number, Partial<Assistant>>>(
    {}
  );

  useEffect(() => {
    const fetchAssistants = async () => {
      const { data, error } = await supabase
        .from("assistants")
        .select("*")
        .eq("owner", owner);

      if (error) console.error("Fetch error:", error);
      else setAssistants(data);
    };

    fetchAssistants();
  }, [owner]);

  const handleChange = (id: number, field: keyof Assistant, value: unknown) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdate = async (id: number) => {
    const updated = editing[id];
    if (!updated) return;

    const { error } = await supabase
      .from("assistants")
      .update(updated)
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error);
    } else {
      setAssistants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
      setEditing((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return (
    <div className={styles.container}>
      {assistants.map((a) => (
        <div key={a.id} className={styles.card}>
          <input
            className={styles.input}
            value={editing[a.id]?.assistant_name ?? a.assistant_name}
            onChange={(e) =>
              handleChange(a.id, "assistant_name", e.target.value)
            }
          />
          <textarea
            className={styles.textarea}
            value={editing[a.id]?.system_prompt ?? a.system_prompt}
            onChange={(e) =>
              handleChange(a.id, "system_prompt", e.target.value)
            }
          />
          <input
            type="number"
            className={styles.input}
            value={editing[a.id]?.current_chunk ?? a.current_chunk}
            onChange={(e) =>
              handleChange(a.id, "current_chunk", Number(e.target.value))
            }
          />
          <input
            type="number"
            className={styles.input}
            value={editing[a.id]?.total_chunks ?? a.total_chunks}
            onChange={(e) =>
              handleChange(a.id, "total_chunks", Number(e.target.value))
            }
          />
          <input
            className={styles.input}
            value={editing[a.id]?.owner ?? a.owner}
            onChange={(e) => handleChange(a.id, "owner", e.target.value)}
          />
          <input
            className={styles.input}
            value={(editing[a.id]?.files ?? a.files).join(", ")}
            onChange={(e) =>
              handleChange(
                a.id,
                "files",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
          <input
            className={styles.input}
            value={(editing[a.id]?.fileids ?? a.fileids).join(", ")}
            onChange={(e) =>
              handleChange(
                a.id,
                "fileids",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={editing[a.id]?.task_completed ?? a.task_completed}
              onChange={(e) =>
                handleChange(a.id, "task_completed", e.target.checked)
              }
            />
            Task Completed
          </label>
          <button className={styles.button} onClick={() => handleUpdate(a.id)}>
            Update Info
          </button>
        </div>
      ))}
    </div>
  );
}
