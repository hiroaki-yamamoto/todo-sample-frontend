import { z } from "zod";

export const TodoSchema = z.object({
  text: z.string().trim().min(1, "Todo text is required"),
});

export const AuthSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
});
