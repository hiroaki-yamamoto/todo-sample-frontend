import { test, expect, mock, describe, afterEach } from "bun:test";
import { render, screen } from "@testing-library/react";

mock.module("react", () => {
  const actual = import.meta.require("react");
  return {
    ...actual,
    useActionState: () => [null, () => { }, false],
  };
});

import RegisterPage from "./page";

describe("RegisterPage", () => {
  afterEach(() => {
    mock.restore();
  });

  test("renders register form", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: "Register" })).toBeTruthy();
    expect(screen.getByPlaceholderText("Username")).toBeTruthy();
    expect(screen.getByPlaceholderText("********")).toBeTruthy();
  });
});
