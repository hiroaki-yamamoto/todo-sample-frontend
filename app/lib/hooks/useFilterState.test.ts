import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'bun:test';
import { useFilterState } from './useFilterState';
import { TODO_STATUS } from '../constants';
import { Todo } from '../types';

const mockTodos: Todo[] = [
  { id: "1", text: 'Buy milk', wipAt: null, completedAt: null },
  { id: "2", text: 'Read book', wipAt: '2023-10-01T12:00:00Z', completedAt: null },
  { id: "3", text: 'Code review', wipAt: '2023-10-01T12:00:00Z', completedAt: '2023-10-05T12:00:00Z' },
];

describe('useFilterState', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.statusFilter).toBe(TODO_STATUS.ALL);
    expect(result.current.isFiltering).toBe(false);
    expect(result.current.filteredTodos).toHaveLength(3);
  });

  it('filters by search query', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    act(() => {
      result.current.setSearchQuery('Buy');
    });

    expect(result.current.searchQuery).toBe('Buy');
    expect(result.current.isFiltering).toBe(true);
    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe('Buy milk');
  });

  it('filters by status WIP', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    act(() => {
      result.current.setStatusFilter(TODO_STATUS.WIP);
    });

    expect(result.current.statusFilter).toBe(TODO_STATUS.WIP);
    expect(result.current.isFiltering).toBe(true);
    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe('Read book');
  });

  it('filters by status COMPLETED', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    act(() => {
      result.current.setStatusFilter(TODO_STATUS.COMPLETED);
    });

    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe('Code review');
  });

  it('filters by WIP date range', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    act(() => {
      result.current.dateRangeProps.wip.onStartDateChange('2023-09-01');
      result.current.dateRangeProps.wip.onEndDateChange('2023-10-02');
    });

    expect(result.current.isFiltering).toBe(true);
    // Since 'Read book' and 'Code review' both have wipAt=2023-10-01, both match wip range.
    expect(result.current.filteredTodos).toHaveLength(2);
  });

  it('filters by Completed date range', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    act(() => {
      result.current.dateRangeProps.completed.onStartDateChange('2023-10-04');
      result.current.dateRangeProps.completed.onEndDateChange('2023-10-06');
    });

    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe('Code review');
  });

  it('clears all filters', () => {
    const { result } = renderHook(() => useFilterState(mockTodos));

    act(() => {
      result.current.setSearchQuery('Buy');
      result.current.setStatusFilter(TODO_STATUS.WIP);
      result.current.dateRangeProps.wip.onStartDateChange('2023-09-01');
    });

    expect(result.current.isFiltering).toBe(true);
    expect(result.current.filteredTodos).toHaveLength(0); // Buy and WIP don't match

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.statusFilter).toBe(TODO_STATUS.ALL);
    expect(result.current.isFiltering).toBe(false);
    expect(result.current.filteredTodos).toHaveLength(3);
  });
});
