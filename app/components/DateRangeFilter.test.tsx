import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, mock } from 'bun:test';
import DateRangeFilter from './DateRangeFilter';
import React from 'react';

describe('DateRangeFilter Component', () => {
  it('renders with given props', () => {
    const mockProps = {
      startDate: '2023-01-01',
      endDate: '2023-01-31',
      onStartDateChange: mock(),
      onEndDateChange: mock()
    };

    render(
      <DateRangeFilter
        label="Custom Date Range"
        dateRangeProps={mockProps}
        startTestId="start-date"
        endTestId="end-date"
      />
    );

    expect(screen.getByText('Custom Date Range')).toBeInTheDocument();

    const startInput = screen.getByTestId('start-date') as HTMLInputElement;
    const endInput = screen.getByTestId('end-date') as HTMLInputElement;

    expect(startInput.value).toBe('2023-01-01');
    expect(endInput.value).toBe('2023-01-31');
  });

  it('calls change handlers when dates are modified', () => {
    const mockOnStartChange = mock();
    const mockOnEndChange = mock();
    const mockProps = {
      startDate: '',
      endDate: '',
      onStartDateChange: mockOnStartChange,
      onEndDateChange: mockOnEndChange
    };

    render(
      <DateRangeFilter
        label="Custom Date Range"
        dateRangeProps={mockProps}
        startTestId="start-date"
        endTestId="end-date"
      />
    );

    const startInput = screen.getByTestId('start-date');
    const endInput = screen.getByTestId('end-date');

    fireEvent.change(startInput, { target: { value: '2023-10-05' } });
    expect(mockOnStartChange).toHaveBeenCalledWith('2023-10-05');

    fireEvent.change(endInput, { target: { value: '2023-11-20' } });
    expect(mockOnEndChange).toHaveBeenCalledWith('2023-11-20');
  });
});
