"use client";

import { useTransition } from "react";
import { Todo } from "../lib/types";
import { markCompletedAction, markWipAction, undoAction } from "../lib/actions";

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();

  const handleWip = () => {
    startTransition(() => {
      markWipAction(todo.id, todo.text);
    });
  };

  const handleComplete = () => {
    startTransition(() => {
      markCompletedAction(todo.id, todo.text, todo.wipAt);
    });
  };

  const handleUndo = () => {
    startTransition(() => {
      const restoreWipAt = todo.completedAt ? todo.wipAt : null;
      undoAction(todo.id, todo.text, restoreWipAt);
    });
  };

  let statusText = "Pending";
  if (todo.completedAt) statusText = "Completed";
  else if (todo.wipAt) statusText = "WIP";

  return (
    <div
      className={`border dark:border-gray-700 p-4 rounded mb-2 flex justify-between items-center transition-colors ${todo.completedAt ? "bg-green-50 dark:bg-green-900/30 opacity-70" : todo.wipAt ? "bg-yellow-50 dark:bg-yellow-900/30" : "bg-white dark:bg-gray-800"
        }`}
      data-testid={`todo-item-${todo.id}`}
    >
      <div>
        <p className={`font-medium ${todo.completedAt ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
          {todo.text}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col mt-1">
          <span>Status: <span data-testid="todo-status">{statusText}</span> | User: {todo.user.name}</span>
          {todo.wipAt && <span>WIP Date: {new Date(todo.wipAt).toLocaleString()}</span>}
          {todo.completedAt && <span>Completed Date: {new Date(todo.completedAt).toLocaleString()}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        {(todo.completedAt || todo.wipAt) && (
          <button
            onClick={handleUndo}
            disabled={isPending}
            className="text-sm bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors text-white px-3 py-1 rounded"
            data-testid="btn-undo"
          >
            Undo
          </button>
        )}
        {!todo.completedAt && !todo.wipAt && (
          <button
            onClick={handleWip}
            disabled={isPending}
            className="text-sm bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors text-white px-3 py-1 rounded"
            data-testid="btn-wip"
          >
            Mark WIP
          </button>
        )}
        {!todo.completedAt && (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="text-sm bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 transition-colors text-white px-3 py-1 rounded"
            data-testid="btn-complete"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
