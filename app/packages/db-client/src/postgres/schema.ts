import {
  pgTable, uuid, varchar, text, boolean, date, timestamp,
  integer, jsonb, inet, decimal, index,
} from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  fhirId: varchar('fhir_id', { length: 64 }).unique().notNull(),
  active: boolean('active').default(true),
  givenName: varchar('given_name', { length: 255 }).notNull(),
  familyName: varchar('family_name', { length: 255 }).notNull(),
  birthDate: date('birth_date').notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  addressLine: text('address_line'),
  addressCity: varchar('address_city', { length: 100 }),
  addressState: varchar('address_state', { length: 100 }),
  addressPostal: varchar('address_postal', { length: 20 }),
  addressCountry: varchar('address_country', { length: 10 }).default('IN'),
  bloodType: varchar('blood_type', { length: 10 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
  version: integer('version').default(1),
}, (table) => [
  index('idx_patients_name').on(table.familyName, table.givenName),
  index('idx_patients_phone').on(table.phone),
  index('idx_patients_fhir_id').on(table.fhirId),
]);

export const conditions = pgTable('conditions', {
  id: uuid('id').defaultRandom().primaryKey(),
  fhirId: varchar('fhir_id', { length: 64 }).unique().notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  codeSystem: varchar('code_system', { length: 255 }),
  codeValue: varchar('code_value', { length: 50 }),
  codeDisplay: varchar('code_display', { length: 500 }).notNull(),
  clinicalStatus: varchar('clinical_status', { length: 50 }).notNull(),
  verificationStatus: varchar('verification_status', { length: 50 }),
  severity: varchar('severity', { length: 50 }),
  onsetDate: date('onset_date'),
  abatementDate: date('abatement_date'),
  recordedDate: timestamp('recorded_date', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
}, (table) => [
  index('idx_conditions_patient').on(table.patientId),
  index('idx_conditions_code').on(table.codeSystem, table.codeValue),
]);

export const medicationStatements = pgTable('medication_statements', {
  id: uuid('id').defaultRandom().primaryKey(),
  fhirId: varchar('fhir_id', { length: 64 }).unique().notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  medicationCode: varchar('medication_code', { length: 50 }),
  medicationSystem: varchar('medication_system', { length: 255 }),
  medicationDisplay: varchar('medication_display', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  dosageText: text('dosage_text'),
  dosageRoute: varchar('dosage_route', { length: 100 }),
  dosageFrequency: varchar('dosage_frequency', { length: 100 }),
  effectiveStart: date('effective_start'),
  effectiveEnd: date('effective_end'),
  sourceType: varchar('source_type', { length: 50 }),
  prescriptionId: uuid('prescription_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
}, (table) => [
  index('idx_medications_patient').on(table.patientId),
]);

export const allergyIntolerances = pgTable('allergy_intolerances', {
  id: uuid('id').defaultRandom().primaryKey(),
  fhirId: varchar('fhir_id', { length: 64 }).unique().notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  codeSystem: varchar('code_system', { length: 255 }),
  codeValue: varchar('code_value', { length: 50 }),
  codeDisplay: varchar('code_display', { length: 500 }).notNull(),
  clinicalStatus: varchar('clinical_status', { length: 50 }).notNull(),
  verificationStatus: varchar('verification_status', { length: 50 }),
  type: varchar('type', { length: 50 }),
  category: varchar('category', { length: 50 }),
  criticality: varchar('criticality', { length: 50 }),
  reactionManifestation: text('reaction_manifestation'),
  reactionSeverity: varchar('reaction_severity', { length: 50 }),
  onsetDate: date('onset_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
}, (table) => [
  index('idx_allergies_patient').on(table.patientId),
]);

export const immunizations = pgTable('immunizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fhirId: varchar('fhir_id', { length: 64 }).unique().notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  vaccineCode: varchar('vaccine_code', { length: 50 }),
  vaccineSystem: varchar('vaccine_system', { length: 255 }),
  vaccineDisplay: varchar('vaccine_display', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  occurrenceDate: date('occurrence_date').notNull(),
  lotNumber: varchar('lot_number', { length: 100 }),
  siteDisplay: varchar('site_display', { length: 100 }),
  doseQuantity: decimal('dose_quantity', { precision: 10, scale: 2 }),
  doseUnit: varchar('dose_unit', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
}, (table) => [
  index('idx_immunizations_patient').on(table.patientId),
]);

export const prescriptions = pgTable('prescriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  imageUrl: text('image_url').notNull(),
  ocrStatus: varchar('ocr_status', { length: 50 }).default('pending'),
  ocrRawText: text('ocr_raw_text'),
  extractedData: jsonb('extracted_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
}, (table) => [
  index('idx_prescriptions_patient').on(table.patientId),
]);

export const consents = pgTable('consents', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  consentType: varchar('consent_type', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  grantedTo: uuid('granted_to'),
  scopeResources: text('scope_resources').array(),
  periodStart: timestamp('period_start', { withTimezone: true }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_consents_patient').on(table.patientId),
]);

export const emergencyCards = pgTable('emergency_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  accessCode: varchar('access_code', { length: 64 }).unique().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  cardData: jsonb('card_data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_emergency_cards_code').on(table.accessCode),
]);

export const clinicalNotes = pgTable('clinical_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  fhirId: varchar('fhir_id', { length: 64 }).unique().notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  doctorId: uuid('doctor_id').notNull(),
  noteType: varchar('note_type', { length: 100 }),
  content: text('content').notNull(),
  encounterDate: timestamp('encounter_date', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_clinical_notes_patient').on(table.patientId),
  index('idx_clinical_notes_doctor').on(table.doctorId),
]);

export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  userRole: varchar('user_role', { length: 50 }).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id').notNull(),
  patientId: uuid('patient_id'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_audit_log_patient').on(table.patientId),
  index('idx_audit_log_user').on(table.userId),
  index('idx_audit_log_time').on(table.createdAt),
]);

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type ConditionRow = typeof conditions.$inferSelect;
export type NewCondition = typeof conditions.$inferInsert;
export type MedicationStatementRow = typeof medicationStatements.$inferSelect;
export type NewMedicationStatement = typeof medicationStatements.$inferInsert;
export type AllergyIntoleranceRow = typeof allergyIntolerances.$inferSelect;
export type NewAllergyIntolerance = typeof allergyIntolerances.$inferInsert;
export type ImmunizationRow = typeof immunizations.$inferSelect;
export type NewImmunization = typeof immunizations.$inferInsert;
export type PrescriptionRow = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;
export type ConsentRow = typeof consents.$inferSelect;
export type NewConsent = typeof consents.$inferInsert;
export type EmergencyCardRow = typeof emergencyCards.$inferSelect;
export type NewEmergencyCard = typeof emergencyCards.$inferInsert;
export type ClinicalNoteRow = typeof clinicalNotes.$inferSelect;
export type NewClinicalNote = typeof clinicalNotes.$inferInsert;
export type AuditLogRow = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
