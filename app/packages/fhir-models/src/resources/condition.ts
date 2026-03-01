import type {
  DomainResource, FhirDateTime, CodeableConcept,
  Reference, Identifier, Annotation,
} from '../types/primitives.js';

export interface Condition extends DomainResource {
  resourceType: 'Condition';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: CodeableConcept[];
  subject: Reference;
  encounter?: Reference;
  onsetDateTime?: FhirDateTime;
  onsetAge?: { value: number; unit: string; system?: string; code?: string };
  onsetPeriod?: { start?: FhirDateTime; end?: FhirDateTime };
  onsetString?: string;
  abatementDateTime?: FhirDateTime;
  abatementAge?: { value: number; unit: string; system?: string; code?: string };
  abatementPeriod?: { start?: FhirDateTime; end?: FhirDateTime };
  abatementString?: string;
  recordedDate?: FhirDateTime;
  recorder?: Reference;
  asserter?: Reference;
  stage?: ConditionStage[];
  evidence?: ConditionEvidence[];
  note?: Annotation[];
}

export interface ConditionStage {
  summary?: CodeableConcept;
  assessment?: Reference[];
  type?: CodeableConcept;
}

export interface ConditionEvidence {
  code?: CodeableConcept[];
  detail?: Reference[];
}

export const CONDITION_CLINICAL_STATUS_SYSTEM = 'http://terminology.hl7.org/CodeSystem/condition-clinical';
export const CONDITION_VERIFICATION_STATUS_SYSTEM = 'http://terminology.hl7.org/CodeSystem/condition-ver-status';
export const CONDITION_CATEGORY_SYSTEM = 'http://terminology.hl7.org/CodeSystem/condition-category';
export const SNOMED_SYSTEM = 'http://snomed.info/sct';
export const ICD10_SYSTEM = 'http://hl7.org/fhir/sid/icd-10';

export type ConditionClinicalStatus = 'active' | 'recurrence' | 'relapse' | 'inactive' | 'remission' | 'resolved';
export type ConditionVerificationStatus = 'unconfirmed' | 'provisional' | 'differential' | 'confirmed' | 'refuted' | 'entered-in-error';
