"use client";

interface DateRangeFilterProps {
  label: string;
  dateRangeProps: {
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
  };
  startTestId: string;
  endTestId: string;
}

export default function DateRangeFilter({
  label,
  dateRangeProps,
  startTestId,
  endTestId,
}: DateRangeFilterProps) {
  const { startDate, endDate, onStartDateChange, onEndDateChange } = dateRangeProps;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="date"
          data-testid={startTestId}
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border px-2 py-1 rounded w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">-</span>
        <input
          type="date"
          data-testid={endTestId}
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border px-2 py-1 rounded w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
