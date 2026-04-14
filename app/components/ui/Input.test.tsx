import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'bun:test';
import { Input } from './Input';
import React from 'react';

describe('Input Component', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border');
  });

  it('applies custom className', () => {
    render(<Input data-testid="test-input" className="custom-test-class" />);
    expect(screen.getByTestId('test-input')).toHaveClass('custom-test-class');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="ref-input" />);
    expect(ref.current).toBe(screen.getByTestId('ref-input'));
  });

  it('can be typed into', () => {
    render(<Input data-testid="typing-input" />);
    const input = screen.getByTestId('typing-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(input.value).toBe('Hello World');
  });

  it('passes standard HTML attributes', () => {
    render(<Input data-testid="disabled-input" disabled type="number" />);
    const input = screen.getByTestId('disabled-input');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('type', 'number');
  });
});
