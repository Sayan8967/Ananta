import { describe, it, expect } from 'vitest';
import { validateMedicationStatement } from '../validators/index.js';

describe('validateMedicationStatement', () => {
  it('should validate a valid medication statement', () => {
    const result = validateMedicationStatement({
      resourceType: 'MedicationStatement',
      status: 'active',
      subject: { reference: 'Patient/123' },
      medicationCodeableConcept: {
        coding: [{ display: 'Metformin 500mg' }],
      },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing status', () => {
    const result = validateMedicationStatement({
      resourceType: 'MedicationStatement',
      subject: { reference: 'Patient/123' },
      medicationCodeableConcept: { coding: [{ display: 'Test' }] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'status' })
    );
  });

  it('should require medication reference or codeable concept', () => {
    const result = validateMedicationStatement({
      resourceType: 'MedicationStatement',
      status: 'active',
      subject: { reference: 'Patient/123' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'medication' })
    );
  });
});
