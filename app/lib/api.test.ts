/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, mock, spyOn, beforeEach, afterEach } from 'bun:test';

const mockCookieGet = (globalThis as any).__mockCookieGet;
const mockCookieSet = (globalThis as any).__mockCookieSet;

import { login, createUser, fetchTodos, createTodo, updateTodo } from './api';

describe('API Utils', () => {
  let fetchMock: ReturnType<typeof spyOn>;

  beforeEach(() => {
    fetchMock = spyOn(globalThis, 'fetch');
    mockCookieGet.mockReset();
    mockCookieSet.mockReset();
  });
  afterEach(() => {
    mock.clearAllMocks();
    mock.restore();
  });

  it('login sends correct payload and extracts cookie', async () => {
    fetchMock.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ data: { login: { id: "1", name: 'test' } } }),
      headers: {
        get: (name: string) => name.toLowerCase() === 'set-cookie' ? 'jwt_token=mock-token; Path=/' : null
      }
    }));
    const res = await login({ name: 'test', password: 'pw' });
    expect(res.name).toBe('test');
    expect(mockCookieSet).toHaveBeenCalledWith('jwt_token', 'mock-token', expect.any(Object));
    expect((fetchMock.mock.calls[0][1] as RequestInit).body).toMatch(/"password":"pw"/);
  });

  it('createUser sends correct payload', async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ data: { createUser: { id: "1", name: 'test' } } })));
    const res = await createUser({ name: 'test', password: 'pw' });
    expect(res.name).toBe('test');
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  it('fetchTodos returns todos array', async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ data: { todos: [{ id: "1", text: 'todo1' }] } })));
    const todos = await fetchTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('todo1');
  });

  it('createTodo returns created todo', async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ data: { createTodo: { id: "1", text: 'new todo' } } })));
    const res = await createTodo({ text: 'new todo' });
    expect(res.text).toBe('new todo');
  });

  it('updateTodo returns updated todo', async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ data: { updateTodo: { id: "1", text: 'updated todo' } } })));
    const res = await updateTodo({ id: "1", text: 'updated todo' });
    expect(res.text).toBe('updated todo');
  });

  it('throws error when fetch returns internal server error', async () => {
    fetchMock.mockImplementation(async () => new Response(null, { status: 500, statusText: 'Internal Server Error' }));
    expect(fetchTodos()).rejects.toThrow('GraphQL request failed: Internal Server Error');
  });

  it('throws error when graphql returns errors', async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ errors: [{ message: 'Not authenticated' }] })));
    expect(fetchTodos()).rejects.toThrow('Not authenticated');
  });
});
