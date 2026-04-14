"use client";

import { useActionState, useRef } from "react";
import { addTodoAction } from "../lib/actions";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

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
      <Input
        type="text"
        name="text"
        placeholder="What needs to be done?"
        required
        disabled={isPending}
        className="flex-1 py-2"
        data-testid="create-todo-input"
      />
      <Button
        type="submit"
        disabled={isPending}
        data-testid="create-todo-submit"
      >
        {isPending ? "Adding..." : "Add"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
