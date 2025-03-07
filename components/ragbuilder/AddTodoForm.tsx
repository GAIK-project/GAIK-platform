'use client';

import { useState } from 'react';

const AddTodoForm = () => {
  const [title, setTitle] = useState('');

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim() === '') return;

    const response = await fetch('/api/addDataToRagBuilderDb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      setTitle('');
      window.location.reload();  // Refresh to show new todo
    } else {
      console.error('Failed to add todo');
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Todo"
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodoForm;