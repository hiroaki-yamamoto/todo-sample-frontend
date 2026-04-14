import { Todo, NewTodo, UpdateTodo, AuthInput } from "./types";
import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/query";

async function fetchGraphQL(query: string, variables?: Record<string, unknown>, extractCookie: boolean = false) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("jwt_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (tokenCookie?.value) {
    headers["Cookie"] = `jwt_token=${tokenCookie.value}`;
  }

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(", "));
  }

  // Handle Set-Cookie if requested (used for login)
  if (extractCookie) {
    const rawSetCookie = res.headers.get("set-cookie");
    if (rawSetCookie) {
      // Very basic parsing since it usually just returns one string.
      // If we use tough-cookie, it's safer, but simplest is to regex out the jwt_token.
      const match = rawSetCookie.match(/jwt_token=([^;]+)/);
      if (match && match[1]) {
        cookieStore.set("jwt_token", match[1], {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 // 24 hours
        });
      }
    }
  }

  return json.data;
}

export async function login(input: AuthInput) {
  const mutation = `
    mutation Login($input: AuthInput!) {
      login(input: $input) {
        id
        name
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input }, true);
  return data.login;
}

export async function createUser(input: AuthInput) {
  const mutation = `
    mutation CreateUser($input: AuthInput!) {
      createUser(input: $input) {
        id
        name
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input }, false);
  return data.createUser;
}

export async function fetchTodos(): Promise<Todo[]> {
  const query = `
    query {
      todos {
        id
        text
        wipAt
        completedAt
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
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { input });
  return data.updateTodo;
}
