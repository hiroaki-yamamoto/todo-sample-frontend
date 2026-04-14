import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, mock } from 'bun:test';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = mock();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-blue-500');

    rerender(<Button variant="danger">Danger</Button>);
    expect(button).toHaveClass('bg-red-500');
  });

  it('applies custom className', () => {
    render(<Button className="custom-test-class">Custom</Button>);
    expect(screen.getByText('Custom')).toHaveClass('custom-test-class');
  });

  it('passes standard HTML attributes', () => {
    render(<Button disabled aria-label="test-button">Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-label', 'test-button');
  });
});
