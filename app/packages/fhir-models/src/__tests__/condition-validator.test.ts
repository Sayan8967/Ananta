import { describe, it, expect } from 'vitest';
import { validateCondition } from '../validators/index.js';

describe('validateCondition', () => {
  it('should validate a valid condition', () => {
    const result = validateCondition({
      resourceType: 'Condition',
      subject: { reference: 'Patient/123' },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus' }],
      },
    });
    expect(result.valid).toBe(true);
  });

  it('should reject wrong resourceType', () => {
    const result = validateCondition({
      resourceType: 'Patient' as any,
      subject: { reference: 'Patient/123' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'resourceType', severity: 'error' })
    );
  });

  it('should require subject reference', () => {
    const result = validateCondition({
      resourceType: 'Condition',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'subject' })
    );
  });

  it('should warn when code is missing', () => {
    const result = validateCondition({
      resourceType: 'Condition',
      subject: { reference: 'Patient/123' },
    });
    // Should still be valid (warning only)
    expect(result.valid).toBe(true);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'code', severity: 'warning' })
    );
  });
});
