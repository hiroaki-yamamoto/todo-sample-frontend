import { test, expect, mock, describe, afterEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock useActionState
mock.module("react", () => {
  const actual = import.meta.require("react");
  return {
    ...actual,
    useActionState: (actionFn: any, initialState: any) => {
      const dispatch = async (payload: any) => {
        if (payload instanceof Event) {
          payload.preventDefault();
          const form = payload.target as HTMLFormElement;
          await actionFn(initialState, new FormData(form));
        } else {
          await actionFn(initialState, payload);
        }
      };
      return [initialState, dispatch, false];
    },
  };
});

// Mock the server action
const mockAddTodoAction = mock(async (formData: FormData) => {
  const text = formData.get("text");
  if (text === "fail") {
    return { error: "Failed to add" };
  }
  return null;
});

// Since Next.js useActionState relies on React 19's features, we need to mock it
// or mock the module importing the action. Let's mock the actions module.
mock.module("../lib/actions", () => ({
  addTodoAction: mockAddTodoAction,
}));

import CreateTodo from "./CreateTodo";

describe("CreateTodo", () => {
  afterEach(() => {
    mockAddTodoAction.mockClear();
  });

  test("renders input and button", () => {
    render(<CreateTodo />);
    expect(screen.getByTestId("create-todo-input")).not.toBeNull();
    expect(screen.getByTestId("create-todo-submit")).not.toBeNull();
  });

  test("submits form data", async () => {
    render(<CreateTodo />);

    const input = screen.getByTestId("create-todo-input") as HTMLInputElement;
    const button = screen.getByTestId("create-todo-submit");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddTodoAction).toHaveBeenCalled();
    });
  });
});
