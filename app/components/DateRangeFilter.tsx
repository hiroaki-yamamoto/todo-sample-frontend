"use client";

interface DateRangeFilterProps {
  label: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  startTestId: string;
  endTestId: string;
}

export default function DateRangeFilter({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startTestId,
  endTestId,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-gray-700">{label}</span>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="date"
          data-testid={startTestId}
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border px-2 py-1 rounded w-full border-gray-300"
        />
        <span className="text-gray-500 hidden sm:inline">-</span>
        <input
          type="date"
          data-testid={endTestId}
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border px-2 py-1 rounded w-full border-gray-300"
        />
      </div>
    </div>
  );
}
