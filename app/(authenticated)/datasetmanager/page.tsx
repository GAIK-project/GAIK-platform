import { createClient } from '@/app/utils/supabaseragbuilder/client';
import styles from '@/app/styles/Monitorpage.module.css';
import { getUserData } from '@/lib/db/drizzle/queries';
import Link from 'next/link';
import AssistantTable from '@/components/ragbuilder/AssistantTable';

export type Assistant = {
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

export default async function MonitorPage() {
  const user = await getUserData();
  const ownerId = user?.email || 'example@domain.com';

  const supabase = await createClient();
  const { data: assistants } = await supabase
    .from('assistants')
    .select()
    .eq('owner', ownerId);

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
      <AssistantTable assistants={assistants} />
    </div>
  );
}
