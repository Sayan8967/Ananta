import { describe, it, expect } from 'vitest';
import { cn, formatDate, getInitials, truncate } from '../../lib/utils';

describe('cn (className merge)', () => {
  it('should merge class names', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toContain('base');
    expect(result).toContain('visible');
    expect(result).not.toContain('hidden');
  });

  it('should resolve tailwind conflicts', () => {
    const result = cn('px-4', 'px-2');
    expect(result).toBe('px-2');
  });
});

describe('formatDate', () => {
  it('should format a valid date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('getInitials', () => {
  it('should return initials from full name', () => {
    expect(getInitials('Priya Sharma')).toBe('PS');
  });

  it('should handle single name', () => {
    expect(getInitials('Priya')).toBe('P');
  });

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('');
  });
});

describe('truncate', () => {
  it('should truncate long strings', () => {
    const result = truncate('This is a very long string that should be truncated', 20);
    expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    expect(result).toContain('...');
  });

  it('should not truncate short strings', () => {
    expect(truncate('Short', 20)).toBe('Short');
  });
});
