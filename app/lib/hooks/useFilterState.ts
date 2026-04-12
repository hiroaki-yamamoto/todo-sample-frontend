import { useState, useMemo } from "react";
import { Todo } from "../types";
import { filterByDateRange, getStatus } from "../todoUtils";
import { TODO_STATUS, TodoStatus } from "../constants";

export function useFilterState(todos: Todo[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [wipStartDate, setWipStartDate] = useState("");
  const [wipEndDate, setWipEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TODO_STATUS.ALL);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (wipStartDate || wipEndDate) {
        if (!filterByDateRange(todo.wipAt, wipStartDate, wipEndDate)) {
          return false;
        }
      }

      if (completedStartDate || completedEndDate) {
        if (!filterByDateRange(todo.completedAt, completedStartDate, completedEndDate)) {
          return false;
        }
      }

      if (statusFilter !== TODO_STATUS.ALL) {
        if (getStatus(todo) !== statusFilter) {
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
    setStatusFilter(TODO_STATUS.ALL);
  };

  const isFiltering =
    searchQuery !== "" ||
    wipStartDate !== "" ||
    wipEndDate !== "" ||
    completedStartDate !== "" ||
    completedEndDate !== "" ||
    statusFilter !== TODO_STATUS.ALL;

  const dateRangeProps = {
    wip: {
      startDate: wipStartDate,
      endDate: wipEndDate,
      onStartDateChange: setWipStartDate,
      onEndDateChange: setWipEndDate,
    },
    completed: {
      startDate: completedStartDate,
      endDate: completedEndDate,
      onStartDateChange: setCompletedStartDate,
      onEndDateChange: setCompletedEndDate,
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateRangeProps,
    filteredTodos,
    clearFilters,
    isFiltering,
  };
}
