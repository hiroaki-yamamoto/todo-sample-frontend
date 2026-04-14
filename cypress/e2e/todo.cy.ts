describe("Todo Application", () => {
  beforeEach(() => {
    // Reset mock backend state
    cy.request("POST", "http://localhost:8080/reset");

    // Login for protected routes natively ahead of visit
    cy.setCookie("jwt_token", "mock-jwt-token");

    cy.visit("/todo");
  });

  it("loads and displays the initial todos", () => {
    cy.get("h1").should("contain", "Todo App");
    cy.get('[data-testid^="todo-item-"]').should("have.length", 1);
    cy.get('[data-testid="todo-text"]').should("contain", "Initial Mock Task");
    cy.get('[data-testid="todo-status"]').should("contain", "Pending");
  });

  it("creates a new todo", () => {
    const todoText = "Write E2E tests for Todo App";
    cy.get('input[name="text"]').type(todoText);
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid^="todo-item-"]').should("have.length", 2);
    cy.get('[data-testid="todo-text"]').contains(todoText).should("be.visible");
  });

  it("completes the full lifecycle of a todo", () => {
    cy.get('[data-testid^="todo-item-"]').first().as("todo");
    cy.get("@todo").find('[data-testid="btn-wip"]').click();
    cy.get("@todo").find('[data-testid="todo-status"]').should("contain", "WIP");
    cy.get("@todo").find('[data-testid="btn-complete"]').click();
    cy.get("@todo").find('[data-testid="todo-status"]').should("contain", "Completed");
  });

  it("filters todos by text", () => {
    cy.get('input[name="text"]').type("Second Task");
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="filter-search"]').type("Second");
    cy.get('[data-testid^="todo-item-"]').should("have.length", 1);
    cy.get('[data-testid="todo-text"]').should("contain", "Second Task");
    cy.get('[data-testid="filter-search"]').clear();
    cy.get('[data-testid^="todo-item-"]').should("have.length", 2);
  });

  it("filters todos by date range (WIP dates)", () => {
    cy.get('[data-testid="btn-wip"]').click();
    cy.get('[data-testid="filter-status"]').select("WIP");
    const today = new Date().toISOString().split("T")[0];
    cy.get('[data-testid="filter-wip-start"]').type(today);
    cy.get('[data-testid="filter-wip-end"]').type(today);
    cy.get('[data-testid^="todo-item-"]').should("have.length", 1);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    cy.get('[data-testid="filter-wip-start"]').clear().type(tomorrow);
    cy.get('[data-testid^="todo-item-"]').should("have.length", 0);
  });

  it("filters by status correctly (showing only Pending limits to initial task without clicking WIP)", () => {
    cy.get('input[name="text"]').type("WIP Task");
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid^="todo-item-"]').last().find('[data-testid="btn-wip"]').click();
    cy.get('[data-testid="filter-status"]').select("Pending");
    cy.get('[data-testid^="todo-item-"]').should("have.length", 1);
    cy.get('[data-testid="todo-status"]').should("contain", "Pending");
    cy.get('[data-testid="filter-status"]').select("WIP");
    cy.get('[data-testid^="todo-item-"]').should("have.length", 1);
    cy.get('[data-testid="todo-status"]').should("contain", "WIP");
  });

  it("allows undoing a completed task back to WIP, then back to pending", () => {
    cy.get('[data-testid="btn-wip"]').click();
    cy.get('[data-testid="btn-complete"]').click();
    cy.get('[data-testid="todo-status"]').should("contain", "Completed");
    cy.get('[data-testid="btn-undo"]').click();
    cy.get('[data-testid="todo-status"]').should("contain", "WIP");
    cy.get('[data-testid="btn-undo"]').click();
    cy.get('[data-testid="todo-status"]').should("contain", "Pending");
  });
});
