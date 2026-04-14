"use server";

import { revalidatePath } from "next/cache";
import { createTodo, updateTodo } from "./api";

export async function addTodoAction(formData: FormData) {
  const text = formData.get("text");
  if (!text || typeof text !== "string") {
    return { error: "Todo text is required" };
  }

  await createTodo({ text });
  revalidatePath("/todo");
}

export async function markWipAction(id: string, text: string) {
  await updateTodo({
    id,
    text,
    wipAt: new Date().toISOString(),
  });
  revalidatePath("/todo");
}

export async function markCompletedAction(id: string, text: string, wipAt?: string | null) {
  await updateTodo({
    id,
    text,
    wipAt,
    completedAt: new Date().toISOString(),
  });
  revalidatePath("/todo");
}

export async function undoAction(id: string, text: string, restoreWipAt?: string | null) {
  await updateTodo({
    id,
    text,
    wipAt: restoreWipAt,
    completedAt: null,
  });
  revalidatePath("/todo");
}

import { login, createUser } from "./api";
import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  try {
    await login({ name, password });
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to login" };
  }

  revalidatePath("/todo");
  redirect("/todo");
}

export async function registerAction(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  try {
    await createUser({ name, password });
    await login({ name, password });
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to register" };
  }

  revalidatePath("/todo");
  redirect("/todo");
}
