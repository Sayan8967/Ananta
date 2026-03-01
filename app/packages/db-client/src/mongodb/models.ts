import mongoose, { Schema, type Document } from 'mongoose';

export interface FhirResourceDocument extends Document {
  resourceType: string;
  fhirId: string;
  resource: Record<string, unknown>;
  meta: {
    versionId: string;
    lastUpdated: Date;
    source: string;
  };
  patientRef: string;
}

const fhirResourceSchema = new Schema<FhirResourceDocument>(
  {
    resourceType: { type: String, required: true, index: true },
    fhirId: { type: String, required: true },
    resource: { type: Schema.Types.Mixed, required: true },
    meta: {
      versionId: { type: String, default: '1' },
      lastUpdated: { type: Date, default: Date.now },
      source: { type: String },
    },
    patientRef: { type: String, index: true },
  },
  {
    timestamps: true,
    collection: 'fhir_resources',
  },
);

fhirResourceSchema.index({ resourceType: 1, fhirId: 1 }, { unique: true });
fhirResourceSchema.index({ resourceType: 1, patientRef: 1 });
fhirResourceSchema.index({ 'meta.lastUpdated': -1 });

export const FhirResource = mongoose.model<FhirResourceDocument>('FhirResource', fhirResourceSchema);

export interface FhirBundleDocument extends Document {
  bundleType: string;
  entries: Record<string, unknown>[];
  userId: string;
}

const fhirBundleSchema = new Schema<FhirBundleDocument>(
  {
    bundleType: { type: String, required: true },
    entries: [{ type: Schema.Types.Mixed }],
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'fhir_bundles',
  },
);

export const FhirBundle = mongoose.model<FhirBundleDocument>('FhirBundle', fhirBundleSchema);
