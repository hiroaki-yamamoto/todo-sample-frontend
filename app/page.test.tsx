import { test, expect, mock, describe, afterEach } from "bun:test";
import { render, screen } from "@testing-library/react";

mock.module("react", () => {
  const actual = import.meta.require("react");
  return {
    ...actual,
    useActionState: () => [null, () => { }, false],
  };
});

import LoginPage from "./page";

describe("LoginPage", () => {
  afterEach(() => {
    mock.restore();
  });

  test("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeTruthy();
    expect(screen.getByPlaceholderText("Username")).toBeTruthy();
    expect(screen.getByPlaceholderText("********")).toBeTruthy();
  });
});
