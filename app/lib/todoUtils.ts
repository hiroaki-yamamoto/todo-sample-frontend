import { Todo } from "./types";
import { TODO_STATUS, TodoStatus } from "./constants";

export function getStatus(todo: Todo): TodoStatus {
  if (todo.completedAt) return TODO_STATUS.COMPLETED;
  if (todo.wipAt) return TODO_STATUS.WIP;
  return TODO_STATUS.PENDING;
}

export function filterByDateRange(dateString: string | null | undefined, startDate: string, endDate: string): boolean {
  if (!startDate && !endDate) return true;
  if (!dateString) return false;

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  if (startDate) {
    const [y, m, d] = startDate.split("-").map(Number);
    const start = new Date(y, m - 1, d);
    start.setHours(0, 0, 0, 0);
    if (targetDate < start) return false;
  }

  if (endDate) {
    const [y, m, d] = endDate.split("-").map(Number);
    const end = new Date(y, m - 1, d);
    end.setHours(23, 59, 59, 999);
    if (targetDate > end) return false;
  }

  return true;
}
