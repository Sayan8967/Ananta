import type { Patient } from '../resources/patient.js';
import type { Condition } from '../resources/condition.js';
import type { MedicationStatement } from '../resources/medication-statement.js';
import type { AllergyIntolerance } from '../resources/allergy-intolerance.js';
import type { Immunization } from '../resources/immunization.js';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export function validatePatient(patient: Partial<Patient>): ValidationResult {
  const errors: ValidationError[] = [];

  if (patient.resourceType !== 'Patient') {
    errors.push({ path: 'resourceType', message: 'resourceType must be "Patient"', severity: 'error' });
  }

  if (!patient.name || patient.name.length === 0) {
    errors.push({ path: 'name', message: 'Patient must have at least one name', severity: 'error' });
  }

  if (patient.gender && !['male', 'female', 'other', 'unknown'].includes(patient.gender)) {
    errors.push({ path: 'gender', message: 'Invalid gender value', severity: 'error' });
  }

  if (patient.birthDate && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(patient.birthDate)) {
    errors.push({ path: 'birthDate', message: 'Invalid date format (expected YYYY, YYYY-MM, or YYYY-MM-DD)', severity: 'error' });
  }

  return { valid: errors.length === 0, errors };
}

export function validateCondition(condition: Partial<Condition>): ValidationResult {
  const errors: ValidationError[] = [];

  if (condition.resourceType !== 'Condition') {
    errors.push({ path: 'resourceType', message: 'resourceType must be "Condition"', severity: 'error' });
  }

  if (!condition.subject) {
    errors.push({ path: 'subject', message: 'Condition must have a subject reference', severity: 'error' });
  }

  if (!condition.code) {
    errors.push({ path: 'code', message: 'Condition should have a code', severity: 'warning' });
  }

  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

export function validateMedicationStatement(med: Partial<MedicationStatement>): ValidationResult {
  const errors: ValidationError[] = [];

  if (med.resourceType !== 'MedicationStatement') {
    errors.push({ path: 'resourceType', message: 'resourceType must be "MedicationStatement"', severity: 'error' });
  }

  if (!med.status) {
    errors.push({ path: 'status', message: 'MedicationStatement must have a status', severity: 'error' });
  }

  if (!med.subject) {
    errors.push({ path: 'subject', message: 'MedicationStatement must have a subject reference', severity: 'error' });
  }

  if (!med.medicationCodeableConcept && !med.medicationReference) {
    errors.push({ path: 'medication', message: 'Must provide medicationCodeableConcept or medicationReference', severity: 'error' });
  }

  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

export function validateAllergyIntolerance(allergy: Partial<AllergyIntolerance>): ValidationResult {
  const errors: ValidationError[] = [];

  if (allergy.resourceType !== 'AllergyIntolerance') {
    errors.push({ path: 'resourceType', message: 'resourceType must be "AllergyIntolerance"', severity: 'error' });
  }

  if (!allergy.patient) {
    errors.push({ path: 'patient', message: 'AllergyIntolerance must have a patient reference', severity: 'error' });
  }

  if (allergy.type && !['allergy', 'intolerance'].includes(allergy.type)) {
    errors.push({ path: 'type', message: 'Invalid type value', severity: 'error' });
  }

  if (allergy.criticality && !['low', 'high', 'unable-to-assess'].includes(allergy.criticality)) {
    errors.push({ path: 'criticality', message: 'Invalid criticality value', severity: 'error' });
  }

  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

export function validateImmunization(immunization: Partial<Immunization>): ValidationResult {
  const errors: ValidationError[] = [];

  if (immunization.resourceType !== 'Immunization') {
    errors.push({ path: 'resourceType', message: 'resourceType must be "Immunization"', severity: 'error' });
  }

  if (!immunization.status) {
    errors.push({ path: 'status', message: 'Immunization must have a status', severity: 'error' });
  }

  if (!immunization.vaccineCode) {
    errors.push({ path: 'vaccineCode', message: 'Immunization must have a vaccineCode', severity: 'error' });
  }

  if (!immunization.patient) {
    errors.push({ path: 'patient', message: 'Immunization must have a patient reference', severity: 'error' });
  }

  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}
