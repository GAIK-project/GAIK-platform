// import { createServerClient } from './../../utils/supabaseragbuilder/server';
import { createClient } from '@/app/utils/supabaseragbuilder/client';
import { cookies } from 'next/headers';
import TodoList from './../../../components/ragbuilder/TodoList';
import AddTodoForm from './../../../components/ragbuilder/AddTodoForm';  // Client Component

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // const { data: todos } = await supabase.from('todos').select();

  // const displaySupadata = async () => {
  //   const { data: todos } = await supabase.from('todos').select();
  //   console.log(todos);
  // }

  return (
    <div>
      <AddTodoForm /> {/* Client Component */}
      <TodoList todos={[]} />
      {/* <button onClick={displaySupadata}>paina</button> */}
    </div>
  );
}
