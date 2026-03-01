import type {
  DomainResource, FhirDateTime, FhirInstant, CodeableConcept,
  Reference, Identifier, Attachment, Coding, Period,
} from '../types/primitives.js';

export interface DocumentReference extends DomainResource {
  resourceType: 'DocumentReference';
  identifier?: Identifier[];
  status: 'current' | 'superseded' | 'entered-in-error';
  docStatus?: 'preliminary' | 'final' | 'amended' | 'entered-in-error';
  type?: CodeableConcept;
  category?: CodeableConcept[];
  subject?: Reference;
  date?: FhirInstant;
  author?: Reference[];
  authenticator?: Reference;
  custodian?: Reference;
  relatesTo?: DocumentReferenceRelatesTo[];
  description?: string;
  securityLabel?: CodeableConcept[];
  content: DocumentReferenceContent[];
  context?: DocumentReferenceContext;
}

export interface DocumentReferenceRelatesTo {
  code: 'replaces' | 'transforms' | 'signs' | 'appends';
  target: Reference;
}

export interface DocumentReferenceContent {
  attachment: Attachment;
  format?: Coding;
}

export interface DocumentReferenceContext {
  encounter?: Reference[];
  event?: CodeableConcept[];
  period?: Period;
  facilityType?: CodeableConcept;
  practiceSetting?: CodeableConcept;
  sourcePatientInfo?: Reference;
  related?: Reference[];
}
