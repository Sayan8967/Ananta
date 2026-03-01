export type FhirId = string;
export type FhirInstant = string;
export type FhirDateTime = string;
export type FhirDate = string;
export type FhirUri = string;
export type FhirCode = string;
export type FhirString = string;
export type FhirBoolean = boolean;
export type FhirInteger = number;
export type FhirDecimal = number;
export type FhirPositiveInt = number;
export type FhirMarkdown = string;

export interface Meta {
  versionId?: string;
  lastUpdated?: FhirInstant;
  source?: string;
  profile?: FhirUri[];
}

export interface Resource {
  resourceType: string;
  id?: FhirId;
  meta?: Meta;
}

export interface DomainResource extends Resource {
  text?: Narrative;
  contained?: Resource[];
  extension?: Extension[];
}

export interface Narrative {
  status: 'generated' | 'extensions' | 'additional' | 'empty';
  div: string;
}

export interface Extension {
  url: FhirUri;
  valueString?: string;
  valueBoolean?: boolean;
  valueCode?: string;
  valueDateTime?: string;
  valueInteger?: number;
  valueDecimal?: number;
  valueCoding?: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueReference?: Reference;
  valuePeriod?: Period;
}

export interface Coding {
  system?: FhirUri;
  version?: string;
  code?: FhirCode;
  display?: FhirString;
  userSelected?: boolean;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Reference {
  reference?: string;
  type?: FhirUri;
  display?: string;
}

export interface Period {
  start?: FhirDateTime;
  end?: FhirDateTime;
}

export interface Identifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: CodeableConcept;
  system?: FhirUri;
  value?: string;
  period?: Period;
}

export interface HumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export interface ContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: FhirPositiveInt;
  period?: Period;
}

export interface Address {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
}

export interface Quantity {
  value?: FhirDecimal;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: FhirUri;
  code?: FhirCode;
}

export interface Annotation {
  authorReference?: Reference;
  authorString?: string;
  time?: FhirDateTime;
  text: FhirMarkdown;
}

export interface Attachment {
  contentType?: FhirCode;
  language?: FhirCode;
  data?: string;
  url?: FhirUri;
  size?: FhirInteger;
  hash?: string;
  title?: string;
  creation?: FhirDateTime;
}
