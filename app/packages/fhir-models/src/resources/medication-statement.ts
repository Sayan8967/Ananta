import type {
  DomainResource, FhirDateTime, CodeableConcept,
  Reference, Identifier, Annotation,
} from '../types/primitives.js';
import type { Dosage } from '../types/datatypes.js';

export interface MedicationStatement extends DomainResource {
  resourceType: 'MedicationStatement';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: MedicationStatementStatus;
  statusReason?: CodeableConcept[];
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  context?: Reference;
  effectiveDateTime?: FhirDateTime;
  effectivePeriod?: { start?: FhirDateTime; end?: FhirDateTime };
  dateAsserted?: FhirDateTime;
  informationSource?: Reference;
  derivedFrom?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  dosage?: Dosage[];
}

export type MedicationStatementStatus =
  | 'active'
  | 'completed'
  | 'entered-in-error'
  | 'intended'
  | 'stopped'
  | 'on-hold'
  | 'unknown'
  | 'not-taken';

export const RXNORM_SYSTEM = 'http://www.nlm.nih.gov/research/umls/rxnorm';
export const MEDICATION_STATEMENT_STATUS_SYSTEM = 'http://hl7.org/fhir/CodeSystem/medication-statement-status';
