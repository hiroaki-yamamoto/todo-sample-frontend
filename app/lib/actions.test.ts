import {
  describe, test, expect, beforeEach, afterEach,
  mock, spyOn,
} from "bun:test";

const mockRevalidatePath = (globalThis as Record<string, unknown>).__mockRevalidatePath;
const mockRedirect = (globalThis as Record<string, unknown>).__mockRedirect;

import * as api from "./api";

describe("actions", () => {
  let mockCreateTodo: ReturnType<typeof spyOn>;
  let mockUpdateTodo: ReturnType<typeof spyOn>;
  let mockLogin: ReturnType<typeof spyOn>;
  let mockCreateUser: ReturnType<typeof spyOn>;
  const anonymousFn = async () => { return undefined as never };
  let actions: typeof import("./actions");

  beforeEach(async () => {
    mockCreateTodo = spyOn(api, "createTodo")
      .mockImplementation(anonymousFn);
    mockUpdateTodo = spyOn(api, "updateTodo")
      .mockImplementation(anonymousFn);
    mockLogin = spyOn(api, "login")
      .mockImplementation(anonymousFn);
    mockCreateUser = spyOn(api, "createUser")
      .mockImplementation(anonymousFn);
    actions = await import("./actions");
  });

  afterEach(() => {
    mock.clearAllMocks();
    mock.restore();
  });

  describe("addTodoAction", () => {
    test("returns error when text is invalid", async () => {
      const formData = new FormData();
      formData.append("text", "");
      const result = await actions.addTodoAction(formData);

      expect(result?.error).toBe("Failed to create Todo");
      expect(result?.fieldErrors).toHaveProperty("text");
      expect(mockCreateTodo).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    test("creates todo and revalidates path on success", async () => {
      const formData = new FormData();
      formData.append("text", "New Task");
      const result = await actions.addTodoAction(formData);

      expect(result == null).toBe(true);
      expect(mockCreateTodo).toHaveBeenCalledWith({ text: "New Task" } as object);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
    });
  });

  describe("markWipAction", () => {
    test("updates todo with wipAt and revalidates path", async () => {
      const id = "1";
      const text = "A task";
      await actions.markWipAction(id, text);

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
      await actions.markCompletedAction(id, text, wipAt);

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
      await actions.undoAction(id, text, restoreWipAt);

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

      const result = await actions.loginAction(null, formData);
      expect(result?.error).toBe("Failed to login");
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test("returns generic error if login throws", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

      const formData = new FormData();
      formData.append("name", "testuser");
      formData.append("password", "password123");

      const result = await actions.loginAction(null, formData);
      expect(result?.error).toBe("Invalid credentials");
      expect(mockLogin).toHaveBeenCalledWith({ name: "testuser", password: "password123" });
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    test("calls login, revalidates and redirects on success", async () => {
      const formData = new FormData();
      formData.append("name", "testuser");
      formData.append("password", "password123");

      await actions.loginAction(null, formData);
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
      const result = await actions.registerAction(null, formData);

      expect(result?.error).toBe("Failed to register");
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    test("returns error if createUser fails", async () => {
      mockCreateUser.mockRejectedValueOnce(new Error("User already exists"));

      const formData = new FormData();
      formData.append("name", "testuser");
      formData.append("password", "password123");

      const result = await actions.registerAction(null, formData);
      expect(result?.error).toBe("User already exists");
      expect(mockCreateUser).toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test("creates user, logs in, revalidates and redirects on success", async () => {
      const formData = new FormData();
      formData.append("name", "newuser");
      formData.append("password", "password123");

      await actions.registerAction(null, formData);

      expect(mockCreateUser).toHaveBeenCalledWith({ name: "newuser", password: "password123" });
      expect(mockLogin).toHaveBeenCalledWith({ name: "newuser", password: "password123" });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/todo");
      expect(mockRedirect).toHaveBeenCalledWith("/todo");
    });
  });
});
