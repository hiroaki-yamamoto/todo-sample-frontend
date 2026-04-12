import { Todo } from "../lib/types";
import TodoItem from "./TodoItem";

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return <p className="text-gray-500 italic py-4" data-testid="empty-message">No todos yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2 mt-4" data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
