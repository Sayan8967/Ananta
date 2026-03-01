import { describe, it, expect } from 'vitest';
import { validateImmunization } from '../validators/index.js';

describe('validateImmunization', () => {
  it('should validate a valid immunization', () => {
    const result = validateImmunization({
      resourceType: 'Immunization',
      status: 'completed',
      vaccineCode: {
        coding: [{ display: 'COVID-19 Vaccine' }],
      },
      patient: { reference: 'Patient/123' },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should require status', () => {
    const result = validateImmunization({
      resourceType: 'Immunization',
      vaccineCode: { coding: [{ display: 'Test' }] },
      patient: { reference: 'Patient/123' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'status' })
    );
  });

  it('should require vaccineCode', () => {
    const result = validateImmunization({
      resourceType: 'Immunization',
      status: 'completed',
      patient: { reference: 'Patient/123' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'vaccineCode' })
    );
  });

  it('should require patient reference', () => {
    const result = validateImmunization({
      resourceType: 'Immunization',
      status: 'completed',
      vaccineCode: { coding: [{ display: 'Test' }] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'patient' })
    );
  });
});
