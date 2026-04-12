import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "./TodoList";
import { Todo } from "../lib/types";

// Mock TodoItem because we just want to test filtering logic
jest.mock("./TodoItem", () => {
  return function MockTodoItem({ todo }: { todo: Todo }) {
    return <div data-testid={`todo-item-${todo.id}`}>{todo.text}</div>;
  };
});

const mockTodos: Todo[] = [
  {
    id: "1",
    text: "Buy groceries",
    user: { id: "u1", name: "Alice" },
  },
  {
    id: "2",
    text: "Finish report",
    wipAt: "2024-10-01T10:00:00Z",
    user: { id: "u1", name: "Alice" },
  },
  {
    id: "3",
    text: "Walk the dog",
    wipAt: "2024-10-05T10:00:00Z",
    completedAt: "2024-10-06T10:00:00Z",
    user: { id: "u1", name: "Alice" },
  },
];

describe("TodoList filtering", () => {
  it("renders 'No todos yet.' if overall empty", () => {
    render(<TodoList todos={[]} />);
    expect(screen.getByTestId("empty-message")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-filters")).not.toBeInTheDocument();
  });

  it("renders all items initially", () => {
    render(<TodoList todos={mockTodos} />);
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(3);
  });

  it("filters by search text", () => {
    render(<TodoList todos={mockTodos} />);
    const searchInput = screen.getByTestId("filter-search");

    fireEvent.change(searchInput, { target: { value: "report" } });
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(1);
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();
  });

  it("filters by WIP date range", () => {
    render(<TodoList todos={mockTodos} />);
    const startInput = screen.getByTestId("filter-wip-start");

    // "Buy groceries" has no wipAt, "Finish report" is Oct 1, "Walk the dog" is Oct 5
    fireEvent.change(startInput, { target: { value: "2024-10-02" } }); // Should match only "Walk the dog"

    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(1);
    expect(screen.getByTestId("todo-item-3")).toBeInTheDocument();

    const endInput = screen.getByTestId("filter-wip-end");
    fireEvent.change(endInput, { target: { value: "2024-10-04" } }); // Should match none now
    expect(screen.getByTestId("empty-filtered-message")).toBeInTheDocument();
  });

  it("filters by completed date range", () => {
    render(<TodoList todos={mockTodos} />);
    const endInput = screen.getByTestId("filter-completed-end");

    // Only 'Walk the dog' is completed on Oct 6.
    fireEvent.change(endInput, { target: { value: "2024-09-01" } }); // Too old
    expect(screen.queryByTestId("todo-item-3")).not.toBeInTheDocument();

    fireEvent.change(endInput, { target: { value: "2024-10-10" } }); // Should include it again
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(1);
  });

  it("clears filters", () => {
    render(<TodoList todos={mockTodos} />);
    const searchInput = screen.getByTestId("filter-search");

    fireEvent.change(searchInput, { target: { value: "nothing matches this" } });
    expect(screen.queryAllByTestId(/todo-item-/)).toHaveLength(0);

    const clearBtn = screen.getByTestId("filter-clear");
    fireEvent.click(clearBtn);

    // List should be back to full
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(3);
    expect((searchInput as HTMLInputElement).value).toBe("");
  });

  it("filters by status", () => {
    render(<TodoList todos={mockTodos} />);
    const statusSelect = screen.getByTestId("filter-status");

    // Default is All
    expect(statusSelect).toHaveValue("All");

    // Pending
    fireEvent.change(statusSelect, { target: { value: "Pending" } });
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(1);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();

    // WIP
    fireEvent.change(statusSelect, { target: { value: "WIP" } });
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(1);
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();

    // Completed
    fireEvent.change(statusSelect, { target: { value: "Completed" } });
    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(1);
    expect(screen.getByTestId("todo-item-3")).toBeInTheDocument();
  });
});
