import type {
  DomainResource, FhirDateTime, CodeableConcept,
  Reference, Identifier, Attachment, Coding, Period,
} from '../types/primitives.js';

export interface Consent extends DomainResource {
  resourceType: 'Consent';
  identifier?: Identifier[];
  status: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive' | 'entered-in-error';
  scope: CodeableConcept;
  category: CodeableConcept[];
  patient?: Reference;
  dateTime?: FhirDateTime;
  performer?: Reference[];
  organization?: Reference[];
  sourceAttachment?: Attachment;
  sourceReference?: Reference;
  policy?: ConsentPolicy[];
  policyRule?: CodeableConcept;
  provision?: ConsentProvision;
}

export interface ConsentPolicy {
  authority?: string;
  uri?: string;
}

export interface ConsentProvision {
  type?: 'deny' | 'permit';
  period?: Period;
  actor?: ConsentProvisionActor[];
  action?: CodeableConcept[];
  securityLabel?: Coding[];
  purpose?: Coding[];
  class?: Coding[];
  code?: CodeableConcept[];
  dataPeriod?: Period;
  data?: ConsentProvisionData[];
  provision?: ConsentProvision[];
}

export interface ConsentProvisionActor {
  role: CodeableConcept;
  reference: Reference;
}

export interface ConsentProvisionData {
  meaning: 'instance' | 'related' | 'dependents' | 'authoredby';
  reference: Reference;
}

export const CONSENT_SCOPE_SYSTEM = 'http://terminology.hl7.org/CodeSystem/consentscope';
export const CONSENT_CATEGORY_SYSTEM = 'http://terminology.hl7.org/CodeSystem/consentcategorycodes';
