"use server";

import { revalidatePath } from "next/cache";
import * as api from "./api";
import { TodoSchema, AuthSchema } from "./schemas";

export async function addTodoAction(formData: FormData) {
  const text = formData.get("text");

  const validatedFields = TodoSchema.safeParse({
    text: text,
  });

  if (!validatedFields.success) {
    return {
      error: "Failed to create Todo",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await api.createTodo({ text: validatedFields.data.text });
  revalidatePath("/todo");
}

export async function markWipAction(id: string, text: string) {
  await api.updateTodo({
    id,
    text,
    wipAt: new Date().toISOString(),
  });
  revalidatePath("/todo");
}

export async function markCompletedAction(id: string, text: string, wipAt?: string | null) {
  await api.updateTodo({
    id,
    text,
    wipAt,
    completedAt: new Date().toISOString(),
  });
  revalidatePath("/todo");
}

export async function undoAction(id: string, text: string, restoreWipAt?: string | null) {
  await api.updateTodo({
    id,
    text,
    wipAt: restoreWipAt,
    completedAt: null,
  });
  revalidatePath("/todo");
}

import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const validatedFields = AuthSchema.safeParse({ name, password });

  if (!validatedFields.success) {
    return {
      error: "Failed to login",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await api.login({ name: validatedFields.data.name, password: validatedFields.data.password });
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to login" };
  }

  revalidatePath("/todo");
  redirect("/todo");
}

export async function registerAction(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const validatedFields = AuthSchema.safeParse({ name, password });

  if (!validatedFields.success) {
    return {
      error: "Failed to register",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await api.createUser({ name: validatedFields.data.name, password: validatedFields.data.password });
    await api.login({ name: validatedFields.data.name, password: validatedFields.data.password });
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to register" };
  }

  revalidatePath("/todo");
  redirect("/todo");
}
