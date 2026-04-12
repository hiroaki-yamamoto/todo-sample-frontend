import { serve } from "bun";

const defaultTodos = [
  { id: "1", text: "Initial Mock Task", wipAt: null, completedAt: null, user: { id: "u1", name: "Alice" } }
];
let todos = [...defaultTodos];

serve({
  port: 8080,
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }});
    }
    
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/reset") {
       todos = JSON.parse(JSON.stringify(defaultTodos));
       return new Response("OK");
    }

    if (req.method === "POST" && url.pathname === "/query") {
      return req.json().then((body: { query: string; variables: Record<string, unknown> }) => {
        const { query, variables } = body;
        
        if (query.includes("mutation CreateTodo")) {
          const newTodo = {
            id: `new-${Date.now()}`,
            text: String(variables?.input ? (variables.input as Record<string, unknown>).text : ""),
            wipAt: null,
            completedAt: null,
            user: { id: "u1", name: "Guest User" }
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
               todo.wipAt = wipAt;
               todo.completedAt = completedAt;
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
console.log("Mock GraphQL server running on port 8080");
