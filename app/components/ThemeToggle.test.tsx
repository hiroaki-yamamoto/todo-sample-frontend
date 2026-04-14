import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { ThemeToggle } from './ThemeToggle';
import React from 'react';

const mockSetTheme = mock();
let mockTheme = 'light';

mock.module("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = 'light';
  });

  it('renders the theme toggle buttons eventually', () => {
    render(<ThemeToggle />);

    // Since React Testing Library runs effects synchronously, it will
    // transition from unmounted to mounted and render buttons.
    expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
    expect(screen.getByLabelText('System mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
  });

  it('changes theme on click', () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByLabelText('Dark mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByLabelText('System mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('system');

    fireEvent.click(screen.getByLabelText('Light mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
