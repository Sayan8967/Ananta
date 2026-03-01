import type { CodeableConcept, Quantity, FhirCode, Period, Reference } from './primitives.js';

export interface Dosage {
  sequence?: number;
  text?: string;
  additionalInstruction?: CodeableConcept[];
  patientInstruction?: string;
  timing?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: DoseAndRate[];
  maxDosePerPeriod?: Ratio;
  maxDosePerAdministration?: Quantity;
  maxDosePerLifetime?: Quantity;
}

export interface DoseAndRate {
  type?: CodeableConcept;
  doseQuantity?: Quantity;
  doseRange?: Range;
  rateRatio?: Ratio;
  rateRange?: Range;
  rateQuantity?: Quantity;
}

export interface Timing {
  event?: string[];
  repeat?: TimingRepeat;
  code?: CodeableConcept;
}

export interface TimingRepeat {
  boundsDuration?: Duration;
  boundsPeriod?: Period;
  boundsRange?: Range;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: FhirCode;
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: FhirCode;
  dayOfWeek?: FhirCode[];
  timeOfDay?: string[];
  when?: FhirCode[];
  offset?: number;
}

export interface Range {
  low?: Quantity;
  high?: Quantity;
}

export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface Duration extends Quantity {
  // Duration is a specialization of Quantity
}

export interface Reaction {
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  exposureRoute?: CodeableConcept;
  note?: { text: string }[];
}

export interface OperationOutcome {
  resourceType: 'OperationOutcome';
  issue: OperationOutcomeIssue[];
}

export interface OperationOutcomeIssue {
  severity: 'fatal' | 'error' | 'warning' | 'information';
  code: string;
  details?: CodeableConcept;
  diagnostics?: string;
  location?: string[];
  expression?: string[];
}

export type EmergencyCardData = {
  patientName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  allergies: Array<{
    substance: string;
    criticality: string;
    reaction?: string;
  }>;
  activeConditions: Array<{
    name: string;
    severity?: string;
  }>;
  currentMedications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;
};

export type TimelineEntry = {
  id: string;
  resourceType: string;
  date: string;
  title: string;
  description?: string;
  category: 'condition' | 'medication' | 'allergy' | 'immunization' | 'encounter' | 'procedure' | 'observation';
  severity?: string;
  status?: string;
  source?: Reference;
};
