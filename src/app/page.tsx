'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!task.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || '',
    };
    setTodos([newTodo, ...todos]);
    setTask('');
    setDueDate('');
    inputRef.current?.focus();
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-6 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Taskify
        </h1>

        {/* Task Input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none text-sm sm:text-base"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm sm:text-base ${filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 dark:bg-gray-700 dark:text-white text-black hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          <AnimatePresence>
            {filteredTodos.length === 0 && (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400"
              >
                No tasks
              </motion.li>
            )}

            {filteredTodos.map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded"
              >
                <div className="flex-1 mb-2 sm:mb-0 sm:mr-4">
                  <input
                    type="text"
                    value={todo.text}
                    onChange={(e) => editTodo(todo.id, e.target.value)}
                    className={`w-full bg-transparent outline-none text-sm sm:text-base ${todo.completed ? 'line-through text-gray-500' : ''
                      }`}
                  />
                  <div className="text-xs text-gray-500">
                    Created: {new Date(todo.createdAt).toLocaleString()}
                  </div>
                  {todo.dueDate && (
                    <div
                      className={`text-xs ${!todo.completed && new Date(todo.dueDate) < new Date()
                        ? 'text-red-500 font-semibold'
                        : 'text-yellow-400'
                        }`}
                    >
                      Due: {todo.dueDate}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {todo.completed ? (
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      title="Undo"
                      className="text-yellow-400 hover:text-yellow-600 text-sm"
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      title="Mark as complete"
                      className="text-green-500 hover:text-green-700 text-lg"
                    >
                      ✔
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete"
                    className="text-red-400 hover:text-red-600 text-lg"
                  >
                    ❌
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <footer className="text-center mt-12 text-white/60">
          <p>&copy; 2025 Taskify a ToDo App Made by Shreyash Malusare.</p>
        </footer>
      </div>
    </div>
  );
}
