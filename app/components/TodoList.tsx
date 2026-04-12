"use client";

import { useState, useMemo } from "react";
import { Todo } from "../lib/types";
import TodoItem from "./TodoItem";
import DateRangeFilter from "./DateRangeFilter";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [wipStartDate, setWipStartDate] = useState("");
  const [wipEndDate, setWipEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 1. Filter by search text
      if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 2. Filter by WIP Date Range
      if (wipStartDate || wipEndDate) {
        if (!todo.wipAt) return false;
        const wipDate = new Date(todo.wipAt);
        wipDate.setHours(0, 0, 0, 0);

        if (wipStartDate) {
          const [y, m, d] = wipStartDate.split("-").map(Number);
          const start = new Date(y, m - 1, d);
          start.setHours(0, 0, 0, 0);
          if (wipDate < start) return false;
        }
        if (wipEndDate) {
          const [y, m, d] = wipEndDate.split("-").map(Number);
          const end = new Date(y, m - 1, d);
          end.setHours(23, 59, 59, 999);
          if (wipDate > end) return false;
        }
      }

      // 3. Filter by Completed Date Range
      if (completedStartDate || completedEndDate) {
        if (!todo.completedAt) return false;
        const compDate = new Date(todo.completedAt);
        compDate.setHours(0, 0, 0, 0);

        if (completedStartDate) {
          const [y, m, d] = completedStartDate.split("-").map(Number);
          const start = new Date(y, m - 1, d);
          start.setHours(0, 0, 0, 0);
          if (compDate < start) return false;
        }
        if (completedEndDate) {
          const [y, m, d] = completedEndDate.split("-").map(Number);
          const end = new Date(y, m - 1, d);
          end.setHours(23, 59, 59, 999);
          if (compDate > end) return false;
        }
      }

      // 4. Filter by Status
      if (statusFilter !== "All") {
        let currentStatus = "Pending";
        if (todo.completedAt) {
          currentStatus = "Completed";
        } else if (todo.wipAt) {
          currentStatus = "WIP";
        }
        if (currentStatus !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [todos, searchQuery, wipStartDate, wipEndDate, completedStartDate, completedEndDate, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setWipStartDate("");
    setWipEndDate("");
    setCompletedStartDate("");
    setCompletedEndDate("");
    setStatusFilter("All");
  };

  const isFiltering =
    searchQuery || wipStartDate || wipEndDate || completedStartDate || completedEndDate || statusFilter !== "All";

  if (todos.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 italic py-4" data-testid="empty-message">No todos yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Filter UI */}
      <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" data-testid="todo-filters">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700 dark:text-gray-300" htmlFor="search-input">Search Text</label>
          <input
            id="search-input"
            type="text"
            data-testid="filter-search"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-2 py-1 rounded w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700 dark:text-gray-300" htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            data-testid="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-2 py-1 rounded w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="WIP">WIP</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <DateRangeFilter
            label="WIP Date Range"
            startDate={wipStartDate}
            endDate={wipEndDate}
            onStartDateChange={setWipStartDate}
            onEndDateChange={setWipEndDate}
            startTestId="filter-wip-start"
            endTestId="filter-wip-end"
          />
          <DateRangeFilter
            label="Completed Date Range"
            startDate={completedStartDate}
            endDate={completedEndDate}
            onStartDateChange={setCompletedStartDate}
            onEndDateChange={setCompletedEndDate}
            startTestId="filter-completed-start"
            endTestId="filter-completed-end"
          />
        </div>

        {isFiltering && (
          <div className="flex justify-end mt-2">
            <button
              onClick={clearFilters}
              data-testid="filter-clear"
              className="text-white bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2" data-testid="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic py-4" data-testid="empty-filtered-message">
            No todos match the current filters.
          </p>
        ) : (
          filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
}
