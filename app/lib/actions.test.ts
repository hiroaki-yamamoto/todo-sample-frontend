import { describe, test, expect, afterEach, afterAll, spyOn } from "bun:test";

const mockRevalidatePath = (globalThis as Record<string, unknown>).__mockRevalidatePath;
const mockRedirect = (globalThis as Record<string, unknown>).__mockRedirect;

import * as api from "./api";

const mockCreateTodo = spyOn(api, 'createTodo').mockImplementation(async () => undefined as never);
const mockUpdateTodo = spyOn(api, 'updateTodo').mockImplementation(async () => undefined as never);
const mockLogin = spyOn(api, 'login').mockImplementation(async () => undefined as never);
const mockCreateUser = spyOn(api, 'createUser').mockImplementation(async () => undefined as never);

import {
  addTodoAction,
  markWipAction,
  markCompletedAction,
  undoAction,
  loginAction,
  registerAction,
} from "./actions";

describe("actions", () => {
  afterEach(() => {
    mockRevalidatePath.mockClear();
    mockRedirect.mockClear();
    mockCreateTodo.mockClear();
    mockUpdateTodo.mockClear();
    mockLogin.mockClear();
    mockCreateUser.mockClear();
  });

  afterAll(() => {
    mockCreateTodo.mockRestore();
    mockUpdateTodo.mockRestore();
    mockLogin.mockRestore();
    mockCreateUser.mockRestore();
  });

  describe("addTodoAction", () => {
    test("returns error when text is invalid", async () => {
      const formData = new FormData();
      formData.append("text", "");
      const result = await addTodoAction(formData);

      expect(result?.error).toBe("Failed to create Todo");
      expect(result?.fieldErrors).toHaveProperty("text");
      expect(mockCreateTodo).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    test("creates todo and revalidates path on success", async () => {
      const formData = new FormData();
      formData.append("text", "New Task");
      const result = await addTodoAction(formData);

      expect(result == null).toBe(true);
      expect(mockCreateTodo).toHaveBeenCalledWith({ text: "New Task" });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
    });
  });

  describe("markWipAction", () => {
    test("updates todo with wipAt and revalidates path", async () => {
      // Mock Date to ensure deterministic behavior check but simple match works via mock signature checks
      const id = "1";
      const text = "A task";
      await markWipAction(id, text);

      expect(mockUpdateTodo).toHaveBeenCalled();
      const callArgs = mockUpdateTodo.mock.calls[0][0];
      expect(callArgs.id).toBe(id);
      expect(callArgs.text).toBe(text);
      expect(callArgs.wipAt).toBeDefined();
      expect(typeof callArgs.wipAt).toBe("string");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
    });
  });

  describe("markCompletedAction", () => {
    test("updates todo with completedAt and preserves wipAt", async () => {
      const id = "2";
      const text = "Another task";
      const wipAt = "2024-01-01T12:00:00.000Z";
      await markCompletedAction(id, text, wipAt);

      expect(mockUpdateTodo).toHaveBeenCalled();
      const callArgs = mockUpdateTodo.mock.calls[0][0];
      expect(callArgs.id).toBe(id);
      expect(callArgs.text).toBe(text);
      expect(callArgs.wipAt).toBe(wipAt);
      expect(callArgs.completedAt).toBeDefined();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
    });
  });

  describe("undoAction", () => {
    test("clears completedAt and restores wipAt", async () => {
      const id = "3";
      const text = "Undo task";
      const restoreWipAt = "2024-01-01T12:00:00.000Z";
      await undoAction(id, text, restoreWipAt);

      expect(mockUpdateTodo).toHaveBeenCalled();
      const callArgs = mockUpdateTodo.mock.calls[0][0];
      expect(callArgs.id).toBe(id);
      expect(callArgs.text).toBe(text);
      expect(callArgs.wipAt).toBe(restoreWipAt);
      expect(callArgs.completedAt).toBeNull();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
    });
  });

  describe("loginAction", () => {
    test("returns error on validation failure", async () => {
      const formData = new FormData();
      formData.append("name", ""); // invalid empty
      formData.append("password", "");

      const result = await loginAction(null, formData);
      expect(result?.error).toBe("Failed to login");
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test("returns generic error if login throws", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

      const formData = new FormData();
      formData.append("name", "testuser");
      formData.append("password", "password123");

      const result = await loginAction(null, formData);
      expect(result?.error).toBe("Invalid credentials");
      expect(mockLogin).toHaveBeenCalledWith({ name: "testuser", password: "password123" });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    test("calls login, revalidates and redirects on success", async () => {
      const formData = new FormData();
      formData.append("name", "testuser");
      formData.append("password", "password123");

      await loginAction(null, formData);
      expect(mockLogin).toHaveBeenCalledWith({ name: "testuser", password: "password123" });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
      expect(mockRedirect).toHaveBeenCalledWith("/todo");
    });
  });

  describe("registerAction", () => {
    test("returns validation error for invalid input", async () => {
      const formData = new FormData();
      formData.append("name", ""); // invalid empty
      formData.append("password", "");
      const result = await registerAction(null, formData);

      expect(result?.error).toBe("Failed to register");
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    test("returns error if createUser fails", async () => {
      mockCreateUser.mockRejectedValueOnce(new Error("User already exists"));

      const formData = new FormData();
      formData.append("name", "testuser");
      formData.append("password", "password123");

      const result = await registerAction(null, formData);
      expect(result?.error).toBe("User already exists");
      expect(mockCreateUser).toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test("creates user, logs in, revalidates and redirects on success", async () => {
      const formData = new FormData();
      formData.append("name", "newuser");
      formData.append("password", "password123");

      await registerAction(null, formData);

      expect(mockCreateUser).toHaveBeenCalledWith({ name: "newuser", password: "password123" });
      expect(mockLogin).toHaveBeenCalledWith({ name: "newuser", password: "password123" });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
      expect(mockRedirect).toHaveBeenCalledWith("/todo");
    });
  });
});
