import { describe, it, expect } from 'vitest';
import { validatePatient } from '../validators/index.js';

describe('validatePatient', () => {
  it('should validate a valid patient resource', () => {
    const result = validatePatient({
      resourceType: 'Patient',
      name: [{ family: 'Sharma', given: ['Priya'] }],
      gender: 'female',
      birthDate: '1990-05-15',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject wrong resourceType', () => {
    const result = validatePatient({
      resourceType: 'Observation' as any,
      name: [{ family: 'Test' }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'resourceType' })
    );
  });

  it('should require at least one name', () => {
    const result = validatePatient({
      resourceType: 'Patient',
      name: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'name' })
    );
  });

  it('should reject invalid gender', () => {
    const result = validatePatient({
      resourceType: 'Patient',
      name: [{ family: 'Test' }],
      gender: 'invalid' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'gender' })
    );
  });

  it('should reject invalid birthDate format', () => {
    const result = validatePatient({
      resourceType: 'Patient',
      name: [{ family: 'Test' }],
      birthDate: '15-05-1990',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: 'birthDate' })
    );
  });

  it('should accept partial date formats (YYYY and YYYY-MM)', () => {
    const yearOnly = validatePatient({
      resourceType: 'Patient',
      name: [{ family: 'Test' }],
      birthDate: '1990',
    });
    expect(yearOnly.valid).toBe(true);

    const yearMonth = validatePatient({
      resourceType: 'Patient',
      name: [{ family: 'Test' }],
      birthDate: '1990-05',
    });
    expect(yearMonth.valid).toBe(true);
  });
});
