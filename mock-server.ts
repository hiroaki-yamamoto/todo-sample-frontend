import { serve } from "bun";

const defaultTodos = [
  { id: "1", text: "Initial Mock Task", wipAt: null, completedAt: null }
];
let todos = [...defaultTodos];

const server = serve({
  port: 8080,
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
    }

    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/reset") {
      todos = JSON.parse(JSON.stringify(defaultTodos));
      return new Response("OK");
    }

    if (req.method === "POST" && url.pathname === "/query") {
      return req.json().then((body: { query: string; variables: Record<string, unknown> }) => {
        const { query, variables } = body;

        // Mock auth mutations
        if (query.includes("mutation Login")) {
          const input = variables?.input as Record<string, string>;
          if (input?.name === "invaliduser") {
            return new Response(JSON.stringify({ errors: [{ message: "invalid credentials" }] }), { status: 400 });
          }
          return new Response(JSON.stringify({ data: { login: { id: "u1", name: input?.name || "testuser" } } }), {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": "jwt_token=mock-jwt-token; HttpOnly; Path=/; Max-Age=86400"
            }
          });
        }

        if (query.includes("mutation CreateUser")) {
          const input = variables?.input as Record<string, string>;
          return new Response(JSON.stringify({ data: { createUser: { id: `u-${Date.now()}`, name: input?.name || "newuser" } } }));
        }

        if (query.includes("mutation CreateTodo")) {
          const newTodo = {
            id: `new-${Date.now()}`,
            text: String(variables?.input ? (variables.input as Record<string, unknown>).text : ""),
            wipAt: null,
            completedAt: null
          };
          todos.push(newTodo);
          return new Response(JSON.stringify({ data: { createTodo: newTodo } }));
        }

        if (query.includes("mutation UpdateTodo")) {
          const input = variables?.input as Record<string, unknown> | undefined;
          if (input) {
            const id = input.id as string;
            const wipAt = input.wipAt as string | null;
            const completedAt = input.completedAt as string | null;

            const todo = todos.find(t => t.id === id);
            if (todo) {
              const oldWipAt = todo.wipAt;
              todo.wipAt = wipAt !== undefined ? wipAt : oldWipAt;
              todo.completedAt = completedAt !== undefined ? completedAt : todo.completedAt;
            }
            return new Response(JSON.stringify({ data: { updateTodo: todo } }));
          }
          return new Response(JSON.stringify({ data: { updateTodo: null } }));
        }

        return new Response(JSON.stringify({ data: { todos } }));
      });
    }
    return new Response("Not found", { status: 404 });
  }
});
console.log(`Mock GraphQL server running on port ${server.port}`);

const shutdown = () => {
  console.log("Shutting down gracefully...");
  server.stop(true);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
