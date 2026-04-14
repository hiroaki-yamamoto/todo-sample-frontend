import { render, screen } from '@testing-library/react';
import { describe, it, expect, spyOn, beforeEach } from 'bun:test';
import Page from './page';
import * as api from '../lib/api';

describe('Todo Page Component', () => {
  beforeEach(() => {
    spyOn(api, 'fetchTodos').mockReset();
  });

  it('renders heading and theme toggle, and fetches todos', async () => {
    spyOn(api, 'fetchTodos').mockResolvedValueOnce([
      { id: "1", text: 'Test page todo', wipAt: null, completedAt: null }
    ]);

    const ui = await Page();
    render(ui);

    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByText('Test page todo')).toBeInTheDocument();
  });

  it('gracefully handles fetch errors by rendering empty list', async () => {
    spyOn(api, 'fetchTodos').mockRejectedValueOnce(new Error("Network Error"));

    const ui = await Page();
    render(ui);

    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });
});
