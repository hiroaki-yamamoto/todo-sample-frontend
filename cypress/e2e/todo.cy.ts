describe("Todo App", () => {
  beforeEach(() => {
    // Reset mock backend state
    cy.request("POST", "http://localhost:8080/reset");
  });

  it("loads and displays the initial todos", () => {
    cy.visit("/");

    cy.contains("Todo App").should("be.visible");
    cy.contains("Initial Mock Task").should("be.visible");
    cy.get('[data-testid="todo-status"]').should("contain.text", "Pending");
  });

  it("creates a new todo", () => {
    cy.visit("/");

    // Type in input & add
    cy.get('[data-testid="create-todo-input"]').type("My Next Task");
    cy.get('[data-testid="create-todo-submit"]').click();

    cy.contains("My Next Task", { timeout: 10000 }).should("be.visible");
  });

  it("marks a todo as WIP then Complete", () => {
    cy.visit("/");

    // Initial state
    cy.get('[data-testid="todo-status"]').should("contain.text", "Pending");

    // WIP
    cy.get('[data-testid="btn-wip"]').click();
    cy.contains("WIP").should("be.visible");

    // Complete
    cy.get('[data-testid="btn-complete"]').click();
    cy.contains("Completed").should("be.visible");
  });
});
