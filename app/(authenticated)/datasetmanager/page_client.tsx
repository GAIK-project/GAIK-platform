'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase/createNewClient';
import styles from '@/app/styles/Monitorpage.module.css';
import classNames from 'classnames';
import Link from 'next/link';

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

export default function MonitorPage() {
  const [assistants, setAssistants] = useState<Assistant[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const getUserFromServer = async () => {
          try {
            const res = await fetch('/api/getUserFromServer');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            return data.email;
          } catch (err) {
            console.error('Error fetching user:', err);
            return 'example@domain.com';
          }
        };

        const OWNER_ID = await getUserFromServer();

        const { data, error } = await supabase
          .from('assistants')
          .select()
          .eq('owner', OWNER_ID);

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        if (mounted) {
          setAssistants(data ?? []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        if (mounted) setAssistants([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className={styles.container}><p>Loading...</p></div>;

  if (!assistants || assistants.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>You have not created any custom RAG datasets yet</h2>
        <Link href="/rag-builder">
          <button className={styles.getStartedButton}>Click here to get started</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dataset Monitor</h1>
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
                  <button
                    className={classNames(styles.chatButton, {
                      [styles.active]: a.task_completed,
                      [styles.disabled]: !a.task_completed,
                    })}
                    disabled={!a.task_completed}
                  >
                    Chat with {a.assistant_name}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
