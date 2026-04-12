"use client";

import { useFilterState } from "../lib/hooks/useFilterState";
import { TODO_STATUS, TodoStatus } from "../lib/constants";
import DateRangeFilter from "./DateRangeFilter";

type TodoFiltersProps = {
  useFilterStateProps: ReturnType<typeof useFilterState>;
};

export default function TodoFilters({ useFilterStateProps }: TodoFiltersProps) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateRangeProps,
    clearFilters,
    isFiltering,
  } = useFilterStateProps;

  return (
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
          onChange={(e) => setStatusFilter(e.target.value as TodoStatus)}
          className="border px-2 py-1 rounded w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {Object.values(TODO_STATUS).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DateRangeFilter
          label="WIP Date Range"
          dateRangeProps={dateRangeProps.wip}
          startTestId="filter-wip-start"
          endTestId="filter-wip-end"
        />
        <DateRangeFilter
          label="Completed Date Range"
          dateRangeProps={dateRangeProps.completed}
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
  );
}
