import { describe, it, expect } from 'vitest';
import { validateAllergyIntolerance } from '../validators/index.js';

describe('validateAllergyIntolerance', () => {
  it('should validate a valid allergy', () => {
    const result = validateAllergyIntolerance({
      resourceType: 'AllergyIntolerance',
      patient: { reference: 'Patient/123' },
      type: 'allergy',
      criticality: 'high',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should require patient reference', () => {
    const result = validateAllergyIntolerance({
      resourceType: 'AllergyIntolerance',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'patient' })
    );
  });

  it('should reject invalid type', () => {
    const result = validateAllergyIntolerance({
      resourceType: 'AllergyIntolerance',
      patient: { reference: 'Patient/123' },
      type: 'invalid' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'type' })
    );
  });

  it('should reject invalid criticality', () => {
    const result = validateAllergyIntolerance({
      resourceType: 'AllergyIntolerance',
      patient: { reference: 'Patient/123' },
      criticality: 'medium' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'criticality' })
    );
  });
});
