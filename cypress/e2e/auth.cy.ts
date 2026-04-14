describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:8080/reset");
  });

  it("should display the login page at the root route", () => {
    cy.visit("/");
    cy.get("h1").should("contain", "Login");
    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });

  it("should show an error for invalid login", () => {
    cy.visit("/");
    cy.get('input[name="name"]').type("invaliduser");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="error-message"]').should("exist");
  });

  it("should successfully register, auto-login, and redirect to /todo", () => {
    cy.visit("/register");
    cy.get('input[name="name"]').type("newuser");
    cy.get('input[name="password"]').type("newpass123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/todo");
    cy.get("h1").should("contain", "Todo App");
  });

  it("should successfully login an existing user", () => {
    // First register a user
    cy.request({
      method: "POST",
      url: "http://localhost:8080/query",
      body: {
        query: `mutation { createUser(input: {name: "testuser", password: "testpass"}) { id name } }`
      }
    });

    cy.visit("/");
    cy.get('input[name="name"]').type("testuser");
    cy.get('input[name="password"]').type("testpass");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/todo");
  });

  it("should protect the /todo route and redirect to login if unauthenticated", () => {
    cy.visit("/todo");
    cy.url().should("match", /^http:\/\/localhost:3000\/$/);
    cy.get("h1").should("contain", "Login");
  });
});
