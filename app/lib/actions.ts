"use server";

import { revalidatePath } from "next/cache";
import { createTodo, updateTodo } from "./api";

export async function addTodoAction(formData: FormData) {
  const text = formData.get("text");
  if (!text || typeof text !== "string") {
    return { error: "Todo text is required" };
  }

  await createTodo({ text });
  revalidatePath("/");
}

export async function markWipAction(id: string, text: string) {
  await updateTodo({
    id,
    text,
    wipAt: new Date().toISOString(),
  });
  revalidatePath("/");
}

export async function markCompletedAction(id: string, text: string) {
  await updateTodo({
    id,
    text,
    completedAt: new Date().toISOString(),
  });
  revalidatePath("/");
}
