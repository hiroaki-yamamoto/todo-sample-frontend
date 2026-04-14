import { describe, test, expect } from "bun:test";
import { getStatus, filterByDateRange } from "./todoUtils";
import { TODO_STATUS } from "./constants";

describe("todoUtils", () => {
  describe("getStatus", () => {
    test("returns PENDING when both completedAt and wipAt are null", () => {
      const todo = { id: "1", text: "Test", userId: "user1", createdAt: new Date().toISOString(), completedAt: null, wipAt: null };
      expect(getStatus(todo)).toBe(TODO_STATUS.PENDING);
    });

    test("returns WIP when wipAt is set and completedAt is null", () => {
      const todo = { id: "1", text: "Test", userId: "user1", createdAt: new Date().toISOString(), completedAt: null, wipAt: new Date().toISOString() };
      expect(getStatus(todo)).toBe(TODO_STATUS.WIP);
    });

    test("returns COMPLETED when completedAt is set, even if wipAt is set", () => {
      const todo = { id: "1", text: "Test", userId: "user1", createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), wipAt: new Date().toISOString() };
      expect(getStatus(todo)).toBe(TODO_STATUS.COMPLETED);
    });

    test("returns COMPLETED when completedAt is set and wipAt is null", () => {
      const todo = { id: "1", text: "Test", userId: "user1", createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), wipAt: null };
      expect(getStatus(todo)).toBe(TODO_STATUS.COMPLETED);
    });
  });

  describe("filterByDateRange", () => {
    test("returns true if no start or end date is provided", () => {
      expect(filterByDateRange("2024-01-01T12:00:00Z", "", "")).toBe(true);
    });

    test("returns false if dateString is null or undefined but range is provided", () => {
      expect(filterByDateRange(null, "2024-01-01", "")).toBe(false);
      expect(filterByDateRange(undefined, "", "2024-01-31")).toBe(false);
    });

    test("returns true if date is exactly on the start date", () => {
      expect(filterByDateRange("2024-01-01T00:00:00Z", "2024-01-01", "")).toBe(true);
    });

    test("returns true if date is within the date range", () => {
      expect(filterByDateRange("2024-01-15T12:00:00Z", "2024-01-01", "2024-01-31")).toBe(true);
    });

    test("returns false if date is before the start date", () => {
      expect(filterByDateRange("2023-12-31T23:59:59Z", "2024-01-01", "")).toBe(false);
    });

    test("returns true if date is exactly on the end date", () => {
      expect(filterByDateRange("2024-01-31T23:59:59Z", "", "2024-01-31")).toBe(true);
    });

    test("returns false if date is after the end date", () => {
      expect(filterByDateRange("2024-02-01T00:00:00Z", "", "2024-01-31")).toBe(false);
    });

    test("handles dates ignoring time accurately (start boundary)", () => {
      // "2024-01-01T23:59:59Z" local time might differ, but filterByDateRange strips time of target and aligns with provided start
      // since the implementation strips the time of targetDate to 0,0,0,0
      expect(filterByDateRange("2024-01-01T23:59:59", "2024-01-01", "")).toBe(true);
    });
  });
});
