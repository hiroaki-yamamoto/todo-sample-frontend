"use client";

import { Todo } from "../lib/types";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import { useFilterState } from "../lib/hooks/useFilterState";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const filterStateProps = useFilterState(todos);
  const { filteredTodos } = filterStateProps;

  if (todos.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 italic py-4" data-testid="empty-message">No todos yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      <TodoFilters useFilterStateProps={filterStateProps} />

      <div className="flex flex-col gap-2" data-testid="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic py-4" data-testid="empty-filtered-message">
            No todos match the current filters.
          </p>
        ) : (
          filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
}
