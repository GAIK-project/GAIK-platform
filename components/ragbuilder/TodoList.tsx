type Todo = {
    id: string;
    title: string;
  };
  
  interface TodoListProps {
    todos: Todo[];
  }
  
  const TodoList = ({ todos }: TodoListProps) => (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
  
  export default TodoList;
  