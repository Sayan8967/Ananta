import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../components/ui/button';

describe('Button', () => {
  it('should render with default variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined();
  });

  it('should render with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeDefined();
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toHaveProperty('disabled', true);
  });

  it('should render different sizes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: 'Small' })).toBeDefined();
  });
});
