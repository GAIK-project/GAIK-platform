"use client";

import styles from "@/app/styles/Monitorpage.module.css";
import { cn } from "@/lib/utils";
import ChatRedirectButton from "./ChatRedirectButton";

type Assistant = {
  id: number;
  assistant_name: string;
  owner: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  original_sources: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  system_prompt: string;
  current_chunk: number;
  total_chunks: number;
  created_at: string;
  task_completed: boolean;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `klo ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export default function AssistantTable({
  assistants,
}: {
  assistants: Assistant[];
}) {
  return (
    <div className="overflow-x-auto">
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableRow}>
              <th className={styles.tableCell}>Assistant Name</th>
              <th className={styles.tableCell}>Errors</th>
              <th className={styles.tableCell}>Progress</th>
              <th className={styles.tableCell}>Created At</th>
              <th className={styles.tableCell}>Status</th>
              <th className={styles.tableCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assistants.map((a) => (
              <tr key={a.id} className={styles.tableRow}>
                <td className={styles.tableCell} data-label="Assistant Name">
                  {a.assistant_name}
                </td>
                <td className={styles.tableCell} data-label="Errors">
                  {a.errors ? (
                    <details>
                      <summary>Show Errors</summary>
                      <pre>{JSON.stringify(a.errors, null, 2)}</pre>
                    </details>
                  ) : (
                    "None"
                  )}
                </td>
                <td className={styles.tableCell} data-label="Progress">
                  {a.current_chunk} / {a.total_chunks}
                </td>
                <td className={styles.tableCell} data-label="Created At">
                  {formatDate(a.created_at)}
                </td>
                <td className={styles.tableCell} data-label="Status">
                  {a.task_completed ? (
                    <span className={cn(styles.statusIcon, styles.green)}>
                      ✔
                    </span>
                  ) : (
                    <span className={cn(styles.statusIcon, styles.red)}>✘</span>
                  )}
                </td>
                <td className={styles.tableCell} data-label="Action">
                  <ChatRedirectButton
                    assistantName={a.assistant_name}
                    enabled={a.task_completed}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
