import { createClient } from '@/app/utils/supabaseragbuilder/client';
import styles from '@/app/styles/Monitorpage.module.css';
import { getUserData } from '@/lib/db/drizzle/queries';
import classNames from 'classnames';
import Link from 'next/link';
import dynamic from 'next/dynamic';

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

export default async function MonitorPage() {

  const ChatRedirectButton = dynamic(() => import('@/components/ragbuilder/ChatRedirectButton'), {
    ssr: false,
  });

    const getUserFromServer = async () => {
        const user = await getUserData();
      if (!user?.email) {
        return 'example@domain.com';
      }
    }
    // const getUserFromServer = async () => {
    //     try {
    //         const res = await fetch('/api/getUserFromServer');
    //         if (!res.ok) throw new Error('Failed to fetch');
    //         const data = await res.json();
    //         return data.email;
    //       } catch (err) {
    //         console.error('Error:', err);
    //         return false;
    //       }
    // }

  const supabase = await createClient();
  let OWNER_ID = getUserFromServer() || 'example@domain.com';

  const { data: assistants } = await supabase
    .from('assistants')
    .select()
    .eq('owner', OWNER_ID);

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
