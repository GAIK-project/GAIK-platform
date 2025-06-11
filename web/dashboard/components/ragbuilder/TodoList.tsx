type Todo = {
  id: string;
  todos: string;
};

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => (
  <ul>{todos?.map((todo) => <li key={todo.id}>{todo.todos}</li>)}</ul>
);

export default TodoList;
