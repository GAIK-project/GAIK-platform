'use client';

import ChatRedirectButton from './ChatRedirectButton';
import styles from '@/app/styles/Monitorpage.module.css';
import classNames from 'classnames';

type Assistant = {
    id: number;
    assistant_name: string;
    owner: string;
    original_sources: any;
    errors: any;
    system_prompt: string;
    current_chunk: number;
    total_chunks: number;
    created_at: string;
    task_completed: boolean;
  };

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `klo ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export default function AssistantTable({ assistants }: { assistants: Assistant[] }) {
  return (
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
              <td className={styles.tableCell}>{a.assistant_name}</td>
              <td className={styles.tableCell}>
                {a.errors ? (
                  <details>
                    <summary>Show Errors</summary>
                    <pre>{JSON.stringify(a.errors, null, 2)}</pre>
                  </details>
                ) : (
                  'None'
                )}
              </td>
              <td className={styles.tableCell}>
                {a.current_chunk} / {a.total_chunks}
              </td>
              <td className={styles.tableCell}>{formatDate(a.created_at)}</td>
              <td className={styles.tableCell}>
                {a.task_completed ? (
                  <span className={classNames(styles.statusIcon, styles.green)}>✔</span>
                ) : (
                  <span className={classNames(styles.statusIcon, styles.red)}>✘</span>
                )}
              </td>
              <td className={styles.tableCell}>
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
  );
}
