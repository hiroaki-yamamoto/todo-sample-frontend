import { Todo, NewTodo, UpdateTodo } from "./types";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/query";

async function fetchGraphQL(query: string, variables?: any) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors.map((e: any) => e.message).join(", ")}`);
  }
  return json.data;
}

export async function fetchTodos(): Promise<Todo[]> {
  const query = `
    query {
      todos {
        id
        text
        wipAt
        completedAt
        user {
          id
          name
        }
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.todos || [];
}

export async function createTodo(input: NewTodo): Promise<Todo> {
  const mutation = `
    mutation CreateTodo($input: NewTodo!) {
      createTodo(input: $input) {
        id
        text
        wipAt
        completedAt
        user {
          id
          name
        }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input });
  return data.createTodo;
}

export async function updateTodo(input: UpdateTodo): Promise<Todo> {
  const mutation = `
    mutation UpdateTodo($input: UpdateTodo!) {
      updateTodo(input: $input) {
        id
        text
        wipAt
        completedAt
        user {
          id
          name
        }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input });
  return data.updateTodo;
}
