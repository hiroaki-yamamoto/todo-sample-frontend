import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import TodoFilters from './TodoFilters';
import { TODO_STATUS } from '../lib/constants';
import React from 'react';

describe('TodoFilters Component', () => {
  let mockUseFilterStateProps: unknown;

  beforeEach(() => {
    mockUseFilterStateProps = {
      searchQuery: '',
      setSearchQuery: mock(),
      statusFilter: 'ALL',
      setStatusFilter: mock(),
      isFiltering: false,
      clearFilters: mock(),
      dateRangeProps: {
        wip: {
          startDate: '',
          endDate: '',
          onStartDateChange: mock(),
          onEndDateChange: mock(),
        },
        completed: {
          startDate: '',
          endDate: '',
          onStartDateChange: mock(),
          onEndDateChange: mock(),
        }
      }
    };
  });

  it('renders search input and status select', () => {
    render(<TodoFilters useFilterStateProps={mockUseFilterStateProps} />);

    expect(screen.getByTestId('filter-search')).toBeInTheDocument();
    expect(screen.getByTestId('filter-status')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-clear')).not.toBeInTheDocument();
  });

  it('calls setSearchQuery on input change', () => {
    render(<TodoFilters useFilterStateProps={mockUseFilterStateProps} />);

    const searchInput = screen.getByTestId('filter-search');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockUseFilterStateProps.setSearchQuery).toHaveBeenCalledWith('test');
  });

  it('calls setStatusFilter on select change', () => {
    render(<TodoFilters useFilterStateProps={mockUseFilterStateProps} />);

    const select = screen.getByTestId('filter-status');
    fireEvent.change(select, { target: { value: TODO_STATUS.WIP } });

    expect(mockUseFilterStateProps.setStatusFilter).toHaveBeenCalledWith(TODO_STATUS.WIP);
  });

  it('renders WIP date range when status is WIP', () => {
    mockUseFilterStateProps.statusFilter = TODO_STATUS.WIP;
    render(<TodoFilters useFilterStateProps={mockUseFilterStateProps} />);

    expect(screen.getByText('WIP Date Range')).toBeInTheDocument();
    expect(screen.getByTestId('filter-wip-start')).toBeInTheDocument();
    expect(screen.getByTestId('filter-wip-end')).toBeInTheDocument();
  });

  it('renders Completed date range when status is COMPLETED', () => {
    mockUseFilterStateProps.statusFilter = TODO_STATUS.COMPLETED;
    render(<TodoFilters useFilterStateProps={mockUseFilterStateProps} />);

    expect(screen.getByText('Completed Date Range')).toBeInTheDocument();
    expect(screen.getByTestId('filter-completed-start')).toBeInTheDocument();
    expect(screen.getByTestId('filter-completed-end')).toBeInTheDocument();
  });

  it('renders clear filters button when isFiltering is true', () => {
    mockUseFilterStateProps.isFiltering = true;
    render(<TodoFilters useFilterStateProps={mockUseFilterStateProps} />);

    const clearBtn = screen.getByTestId('filter-clear');
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(mockUseFilterStateProps.clearFilters).toHaveBeenCalled();
  });
});
