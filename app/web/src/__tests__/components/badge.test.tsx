import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/ui/badge';

describe('Badge', () => {
  it('should render with default variant', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeDefined();
  });

  it('should render with success variant', () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active')).toBeDefined();
  });

  it('should render with destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText('Error')).toBeDefined();
  });

  it('should render with warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toBeDefined();
  });
});
