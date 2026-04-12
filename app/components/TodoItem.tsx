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
      className={`border p-4 rounded mb-2 flex justify-between items-center ${todo.completedAt ? "bg-green-50 opacity-70" : todo.wipAt ? "bg-yellow-50" : "bg-white"
        }`}
      data-testid={`todo-item-${todo.id}`}
    >
      <div>
        <p className={`font-medium ${todo.completedAt ? "line-through text-gray-500" : ""}`}>
          {todo.text}
        </p>
        <div className="text-xs text-gray-500 flex flex-col mt-1">
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
            className="text-sm bg-gray-500 hover:bg-gray-600 transition-colors text-white px-3 py-1 rounded"
            data-testid="btn-undo"
          >
            Undo
          </button>
        )}
        {!todo.completedAt && !todo.wipAt && (
          <button
            onClick={handleWip}
            disabled={isPending}
            className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
            data-testid="btn-wip"
          >
            Mark WIP
          </button>
        )}
        {!todo.completedAt && (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded"
            data-testid="btn-complete"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
