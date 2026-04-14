import { test, expect, describe, afterEach, spyOn } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "./TodoItem";

import * as actions from "../lib/actions";

const mockMarkWipAction = spyOn(actions, "markWipAction").mockImplementation(async () => { });
const mockMarkCompletedAction = spyOn(actions, "markCompletedAction").mockImplementation(async () => { });
const mockUndoAction = spyOn(actions, "undoAction").mockImplementation(async () => { });

const mockTodo = {
  id: "1",
  text: "Test Task",
  wipAt: null,
  completedAt: null,
};

describe("TodoItem", () => {
  afterEach(() => {
    mockMarkWipAction.mockClear();
    mockMarkCompletedAction.mockClear();
    mockUndoAction.mockClear();
  });

  test("renders pending todo", () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByText("Test Task")).not.toBeNull();
    expect(screen.getByTestId("todo-status").textContent).toBe("Pending");
    expect(screen.getByTestId("btn-wip")).not.toBeNull();
    expect(screen.getByTestId("btn-complete")).not.toBeNull();
    expect(screen.queryByTestId("btn-undo")).toBeNull();
  });

  test("renders wip todo", () => {
    render(<TodoItem todo={{ ...mockTodo, wipAt: "2024-01-01" }} />);
    expect(screen.getByTestId("todo-status").textContent).toBe("WIP");
    // Should not show WIP button anymore
    expect(screen.queryByTestId("btn-wip")).toBeNull();
    expect(screen.getByTestId("btn-complete")).not.toBeNull();
    expect(screen.getByTestId("btn-undo")).not.toBeNull();
  });

  test("renders completed todo", () => {
    render(<TodoItem todo={{ ...mockTodo, completedAt: "2024-01-01" }} />);
    expect(screen.getByTestId("todo-status").textContent).toBe("Completed");
    // Should not show any buttons except undo
    expect(screen.queryByTestId("btn-wip")).toBeNull();
    expect(screen.queryByTestId("btn-complete")).toBeNull();
    expect(screen.getByTestId("btn-undo")).not.toBeNull();
  });

  test("clicking WIP calls action", () => {
    render(<TodoItem todo={mockTodo} />);
    const wipBtn = screen.getByTestId("btn-wip");
    fireEvent.click(wipBtn);
    expect(mockMarkWipAction).toHaveBeenCalledWith("1", "Test Task");
  });

  test("clicking Complete calls action", () => {
    render(<TodoItem todo={{ ...mockTodo, wipAt: "2024-01-01" }} />);
    const completeBtn = screen.getByTestId("btn-complete");
    fireEvent.click(completeBtn);
    expect(mockMarkCompletedAction).toHaveBeenCalledWith("1", "Test Task", "2024-01-01");
  });

  test("clicking Undo from WIP calls action with null restoreWipAt", () => {
    render(<TodoItem todo={{ ...mockTodo, wipAt: "2024-01-01" }} />);
    const undoBtn = screen.getByTestId("btn-undo");
    fireEvent.click(undoBtn);
    expect(mockUndoAction).toHaveBeenCalledWith("1", "Test Task", null);
  });

  test("clicking Undo from Completed (with wipAt) calls action restoring wipAt", () => {
    render(<TodoItem todo={{ ...mockTodo, completedAt: "2024-01-02", wipAt: "2024-01-01" }} />);
    const undoBtn = screen.getByTestId("btn-undo");
    fireEvent.click(undoBtn);
    expect(mockUndoAction).toHaveBeenCalledWith("1", "Test Task", "2024-01-01");
  });

  test("clicking Undo from Completed (no wipAt) calls action with null restoreWipAt", () => {
    render(<TodoItem todo={{ ...mockTodo, completedAt: "2024-01-02" }} />);
    const undoBtn = screen.getByTestId("btn-undo");
    fireEvent.click(undoBtn);
    expect(mockUndoAction).toHaveBeenCalledWith("1", "Test Task", null);
  });
});
