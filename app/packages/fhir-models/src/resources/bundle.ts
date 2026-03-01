import type { Resource, FhirUri, FhirInstant, Identifier } from '../types/primitives.js';

export interface Bundle extends Resource {
  resourceType: 'Bundle';
  identifier?: Identifier;
  type: BundleType;
  timestamp?: FhirInstant;
  total?: number;
  link?: BundleLink[];
  entry?: BundleEntry[];
}

export interface BundleLink {
  relation: string;
  url: FhirUri;
}

export interface BundleEntry {
  link?: BundleLink[];
  fullUrl?: FhirUri;
  resource?: Resource;
  search?: BundleEntrySearch;
  request?: BundleEntryRequest;
  response?: BundleEntryResponse;
}

export interface BundleEntrySearch {
  mode?: 'match' | 'include' | 'outcome';
  score?: number;
}

export interface BundleEntryRequest {
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: FhirUri;
  ifNoneMatch?: string;
  ifModifiedSince?: FhirInstant;
  ifMatch?: string;
  ifNoneExist?: string;
}

export interface BundleEntryResponse {
  status: string;
  location?: FhirUri;
  etag?: string;
  lastModified?: FhirInstant;
  outcome?: Resource;
}

export type BundleType =
  | 'document' | 'message' | 'transaction' | 'transaction-response'
  | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';

export function createSearchBundle(resources: Resource[], total: number): Bundle {
  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total,
    entry: resources.map(resource => ({
      resource,
      search: { mode: 'match' as const },
    })),
  };
}
