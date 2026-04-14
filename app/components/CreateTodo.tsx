"use client";

import { useActionState, useRef } from "react";
import { addTodoAction } from "../lib/actions";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function CreateTodo() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, action, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const res = await addTodoAction(formData);
      if (res?.error) {
        return res;
      }
      formRef.current?.reset();
      return null;
    },
    null
  );

  return (
    <div className="mb-4">
      <form ref={formRef} action={action} className="flex gap-2 items-center">
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
      </form>
      {state?.error && !state?.fieldErrors && <p className="text-red-500 text-sm mt-1">{state.error}</p>}
      {state?.fieldErrors?.text && (
        <p className="text-red-500 text-sm mt-1">{state.fieldErrors.text[0]}</p>
      )}
    </div>
  );
}
