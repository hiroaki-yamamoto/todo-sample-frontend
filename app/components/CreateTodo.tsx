"use client";

import { useActionState, useRef } from "react";
import { addTodoAction } from "../lib/actions";

export default function CreateTodo() {
  const formRef = useRef<HTMLFormElement>(null);

  const [error, action, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      const res = await addTodoAction(formData);
      if (res?.error) {
        return res.error;
      }
      formRef.current?.reset();
      return null;
    },
    null
  );

  return (
    <form ref={formRef} action={action} className="flex gap-2 mb-4 items-center">
      <input
        type="text"
        name="text"
        placeholder="What needs to be done?"
        required
        disabled={isPending}
        className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="create-todo-input"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
        data-testid="create-todo-submit"
      >
        {isPending ? "Adding..." : "Add"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
