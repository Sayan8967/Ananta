import type {
  DomainResource, FhirDateTime, CodeableConcept,
  Reference, Identifier, Annotation,
} from '../types/primitives.js';
import type { Reaction } from '../types/datatypes.js';

export interface AllergyIntolerance extends DomainResource {
  resourceType: 'AllergyIntolerance';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: 'allergy' | 'intolerance';
  category?: AllergyCategory[];
  criticality?: 'low' | 'high' | 'unable-to-assess';
  code?: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: FhirDateTime;
  onsetAge?: { value: number; unit: string };
  onsetPeriod?: { start?: FhirDateTime; end?: FhirDateTime };
  onsetString?: string;
  recordedDate?: FhirDateTime;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: FhirDateTime;
  note?: Annotation[];
  reaction?: Reaction[];
}

export type AllergyCategory = 'food' | 'medication' | 'environment' | 'biologic';
export type AllergyClinicalStatus = 'active' | 'inactive' | 'resolved';
export type AllergyVerificationStatus = 'unconfirmed' | 'confirmed' | 'refuted' | 'entered-in-error';

export const ALLERGY_CLINICAL_STATUS_SYSTEM = 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical';
export const ALLERGY_VERIFICATION_STATUS_SYSTEM = 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification';
