import type {
  DomainResource, FhirDate, FhirBoolean, FhirCode,
  Identifier, HumanName, ContactPoint, Address,
  CodeableConcept, Reference, Attachment, Period,
} from '../types/primitives.js';

export interface Patient extends DomainResource {
  resourceType: 'Patient';
  identifier?: Identifier[];
  active?: FhirBoolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: FhirDate;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: Attachment[];
  contact?: PatientContact[];
  communication?: PatientCommunication[];
  generalPractitioner?: Reference[];
  managingOrganization?: Reference;
  link?: PatientLink[];
}

export interface PatientContact {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: FhirCode;
  organization?: Reference;
  period?: Period;
}

export interface PatientCommunication {
  language: CodeableConcept;
  preferred?: boolean;
}

export interface PatientLink {
  other: Reference;
  type: 'replaced-by' | 'replaces' | 'refer' | 'seealso';
}

export const ANANTA_PATIENT_IDENTIFIER_SYSTEM = 'https://ananta.health/fhir/patient-id';
export const ABHA_IDENTIFIER_SYSTEM = 'https://healthid.abdm.gov.in';
export const AADHAAR_IDENTIFIER_SYSTEM = 'https://uidai.gov.in/aadhaar';
