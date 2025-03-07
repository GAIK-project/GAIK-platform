// import { createServerClient } from './../../utils/supabaseragbuilder/server';
import { createClient } from '@/app/utils/supabaseragbuilder/client';
import TodoList from './../../../components/ragbuilder/TodoList';
import AddTodoForm from './../../../components/ragbuilder/AddTodoForm';  // Client Component

export default async function Page() {
  const supabase = await createClient();

  const { data: todos } = await supabase.from('todos').select();


  return (
    <div>
      <AddTodoForm /> {/* Client Component */}
      <TodoList todos={todos || []} />
      <></>
      <></>
    </div>
  );
}
