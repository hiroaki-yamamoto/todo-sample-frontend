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

  it("filters todos by search text", () => {
    cy.visit("/");

    // Add another task to filter against
    cy.get('[data-testid="create-todo-input"]').type("Specific Filter Task");
    cy.get('[data-testid="create-todo-submit"]').click();
    cy.contains("Specific Filter Task", { timeout: 10000 }).should("be.visible");

    // Filter by text
    cy.get('[data-testid="filter-search"]').type("Filter Task");
    cy.contains("Specific Filter Task").should("be.visible");
    cy.contains("Initial Mock Task").should("not.exist");

    // Clear filters
    cy.get('[data-testid="filter-clear"]').click();
    cy.contains("Initial Mock Task").should("be.visible");
  });

  it("filters todos by date ranges", () => {
    cy.visit("/");

    // Create a task and set to WIP
    cy.get('[data-testid="create-todo-input"]').type("Date Filter Task");
    cy.get('[data-testid="create-todo-submit"]').click();
    cy.contains("Date Filter Task", { timeout: 10000 }).should("be.visible");

    // In Cypress, getting the specific newly created task's btn-wip could be tricky if there are multiple.
    // Let's rely on finding by task text and then finding the button inside it.
    // The TodoItem component has the text, but the buttons are alongside it.
    // We can just get the last btn-wip since it's appended.
    cy.get('[data-testid="btn-wip"]').last().click();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Select WIP status filter to show WIP date filters
    cy.get('[data-testid="filter-status"]').select("WIP");

    // Filter WIP Start (yesterday)
    cy.get('[data-testid="filter-wip-start"]').type(yesterdayString);
    cy.contains("Date Filter Task").should("be.visible");

    // Filter WIP End (yesterday) - should hide it
    cy.get('[data-testid="filter-wip-end"]').type(yesterdayString);
    cy.get('[data-testid="empty-filtered-message"]').should("be.visible");
    cy.contains("Date Filter Task").should("not.exist");

    // Clear filter
    cy.get('[data-testid="filter-clear"]').click();
    cy.contains("Date Filter Task").should("be.visible");
  });

  it("filters todos by status", () => {
    cy.visit("/");

    // Create a task and set to WIP
    cy.get('[data-testid="create-todo-input"]').type("WIP Task");
    cy.get('[data-testid="create-todo-submit"]').click();
    cy.contains("WIP Task", { timeout: 10000 }).should("be.visible");
    cy.get('[data-testid="btn-wip"]').last().click();

    // Create a task and set to Completed
    cy.get('[data-testid="create-todo-input"]').type("Completed Task");
    cy.get('[data-testid="create-todo-submit"]').click();
    cy.contains("Completed Task", { timeout: 10000 }).should("be.visible");
    cy.get('[data-testid="btn-wip"]').last().click();
    cy.get('[data-testid="btn-complete"]').last().click();

    // Verify all tasks exist before filtering
    cy.contains("Initial Mock Task").should("be.visible");
    cy.contains("WIP Task").should("be.visible");
    cy.contains("Completed Task").should("be.visible");

    // Filter for Pending
    cy.get('[data-testid="filter-status"]').select("Pending");
    cy.contains("Initial Mock Task").should("be.visible");
    cy.contains("WIP Task").should("not.exist");
    cy.contains("Completed Task").should("not.exist");

    // Filter for WIP
    cy.get('[data-testid="filter-status"]').select("WIP");
    cy.contains("Initial Mock Task").should("not.exist");
    cy.contains("WIP Task").should("be.visible");
    cy.contains("Completed Task").should("not.exist");

    // Filter for Completed
    cy.get('[data-testid="filter-status"]').select("Completed");
    cy.contains("Initial Mock Task").should("not.exist");
    cy.contains("WIP Task").should("not.exist");
    cy.contains("Completed Task").should("be.visible");

    // Clear filters
    cy.get('[data-testid="filter-clear"]').click();
    cy.contains("Initial Mock Task").should("be.visible");
    cy.contains("WIP Task").should("be.visible");
    cy.contains("Completed Task").should("be.visible");
  });

  it("undoes a WIP or Completed todo back to previous states", () => {
    cy.visit("/");

    // Create a new task
    cy.get('[data-testid="create-todo-input"]').type("Undo Test Task");
    cy.get('[data-testid="create-todo-submit"]').click();
    cy.contains("Undo Test Task").should("be.visible");

    // The last task should be "Undo Test Task"
    const lastTaskStatus = () => cy.contains("Undo Test Task").parents('[data-testid^="todo-item-"]').find('[data-testid="todo-status"]');
    const btnWip = () => cy.contains("Undo Test Task").parents('[data-testid^="todo-item-"]').find('[data-testid="btn-wip"]');
    const btnComplete = () => cy.contains("Undo Test Task").parents('[data-testid^="todo-item-"]').find('[data-testid="btn-complete"]');
    const btnUndo = () => cy.contains("Undo Test Task").parents('[data-testid^="todo-item-"]').find('[data-testid="btn-undo"]');

    // Initial state
    lastTaskStatus().should("contain.text", "Pending");

    // Mark as WIP
    btnWip().click();
    lastTaskStatus().should("contain.text", "WIP");

    // Mark as Completed
    btnComplete().click();
    lastTaskStatus().should("contain.text", "Completed");

    // Undo from Completed (should go back to WIP)
    btnUndo().click();
    lastTaskStatus().should("contain.text", "WIP");

    // Undo from WIP (should go back to Pending)
    btnUndo().click();
    lastTaskStatus().should("contain.text", "Pending");

    // Mark directly as Completed from Pending
    btnComplete().click();
    lastTaskStatus().should("contain.text", "Completed");

    // Undo from Completed with no WIP history (should go back to Pending)
    btnUndo().click();
    lastTaskStatus().should("contain.text", "Pending");
  });
});
