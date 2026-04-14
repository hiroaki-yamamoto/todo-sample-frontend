/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockCookieGet = (globalThis as any).__mockCookieGet;
const mockCookieSet = (globalThis as any).__mockCookieSet;

import { login, createUser, fetchTodos, createTodo, updateTodo } from './api';

describe('API Utils', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    mockCookieGet.mockReset();
    mockCookieSet.mockReset();
  });

  it('login sends correct payload and extracts cookie', async () => {
    const mockFetch = mock(async () => ({
      ok: true,
      json: async () => ({ data: { login: { id: "1", name: 'test' } } }),
      headers: {
        get: (name: string) => name.toLowerCase() === 'set-cookie' ? 'jwt_token=mock-token; Path=/' : null
      }
    }));
    globalThis.fetch = mockFetch as any;

    const res = await login({ name: 'test', password: 'pw' });
    expect(res.name).toBe('test');
    expect(mockCookieSet).toHaveBeenCalledWith('jwt_token', 'mock-token', expect.any(Object));
    expect((mockFetch.mock.calls[0][1] as RequestInit).body).toMatch(/"password":"pw"/);
    globalThis.fetch = originalFetch;
  });

  it('createUser sends correct payload', async () => {
    const mockFetch = mock(async () => new Response(JSON.stringify({ data: { createUser: { id: "1", name: 'test' } } })));
    globalThis.fetch = mockFetch as any;

    const res = await createUser({ name: 'test', password: 'pw' });
    expect(res.name).toBe('test');
    expect(mockCookieSet).not.toHaveBeenCalled();
    globalThis.fetch = originalFetch;
  });

  it('fetchTodos returns todos array', async () => {
    const mockFetch = mock(async () => new Response(JSON.stringify({ data: { todos: [{ id: "1", text: 'todo1' }] } })));
    globalThis.fetch = mockFetch as any;

    const todos = await fetchTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('todo1');
    globalThis.fetch = originalFetch;
  });

  it('createTodo returns created todo', async () => {
    const mockFetch = mock(async () => new Response(JSON.stringify({ data: { createTodo: { id: "1", text: 'new todo' } } })));
    globalThis.fetch = mockFetch as any;

    const res = await createTodo({ text: 'new todo' });
    expect(res.text).toBe('new todo');
    globalThis.fetch = originalFetch;
  });

  it('updateTodo returns updated todo', async () => {
    const mockFetch = mock(async () => new Response(JSON.stringify({ data: { updateTodo: { id: "1", text: 'updated todo' } } })));
    globalThis.fetch = mockFetch as any;

    const res = await updateTodo({ id: "1", text: 'updated todo' });
    expect(res.text).toBe('updated todo');
    globalThis.fetch = originalFetch;
  });

  it('throws error when fetch returns internal server error', async () => {
    const mockFetch = mock(async () => new Response(null, { status: 500, statusText: 'Internal Server Error' }));
    globalThis.fetch = mockFetch as any;

    expect(fetchTodos()).rejects.toThrow('GraphQL request failed: Internal Server Error');
    globalThis.fetch = originalFetch;
  });

  it('throws error when graphql returns errors', async () => {
    const mockFetch = mock(async () => new Response(JSON.stringify({ errors: [{ message: 'Not authenticated' }] })));
    globalThis.fetch = mockFetch as any;

    expect(fetchTodos()).rejects.toThrow('Not authenticated');
    globalThis.fetch = originalFetch;
  });
});
