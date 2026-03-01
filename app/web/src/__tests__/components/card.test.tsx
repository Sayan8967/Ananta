import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';

describe('Card', () => {
  it('should render card with all parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content here</p>
        </CardContent>
        <CardFooter>
          <p>Footer</p>
        </CardFooter>
      </Card>
    );
    expect(screen.getByText('Test Card')).toBeDefined();
    expect(screen.getByText('Card content here')).toBeDefined();
    expect(screen.getByText('Footer')).toBeDefined();
  });

  it('should render card without optional parts', () => {
    render(
      <Card>
        <CardContent>
          <p>Simple content</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText('Simple content')).toBeDefined();
  });
});
