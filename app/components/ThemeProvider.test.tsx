import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'bun:test';
import { ThemeProvider } from './ThemeProvider';
import React from 'react';

describe('ThemeProvider Component', () => {
  it('renders its children', () => {
    render(
      <ThemeProvider attribute="class">
        <div data-testid="child">Test Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
