-- =============================================================================
-- Ananta Healthcare Platform - Initial Database Schema
-- Migration: 0001_init.sql
-- Description: Creates all tables, constraints, and indexes for the Ananta
--              lifetime medical history platform.
-- =============================================================================

-- Enable pgcrypto for gen_random_uuid() support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Table: patients
-- FHIR Resource: Patient
-- =============================================================================
CREATE TABLE patients (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    fhir_id         VARCHAR(64)     UNIQUE NOT NULL,
    active          BOOLEAN         DEFAULT TRUE,
    given_name      VARCHAR(255)    NOT NULL,
    family_name     VARCHAR(255)    NOT NULL,
    birth_date      DATE            NOT NULL,
    gender          VARCHAR(20)     NOT NULL,
    phone           VARCHAR(50),
    email           VARCHAR(255),
    address_line    TEXT,
    address_city    VARCHAR(100),
    address_state   VARCHAR(100),
    address_postal  VARCHAR(20),
    address_country VARCHAR(10)     DEFAULT 'IN',
    blood_type      VARCHAR(10),
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW(),
    created_by      UUID,
    version         INTEGER         DEFAULT 1
);

CREATE INDEX idx_patients_name    ON patients (family_name, given_name);
CREATE INDEX idx_patients_phone   ON patients (phone);
CREATE INDEX idx_patients_fhir_id ON patients (fhir_id);

-- =============================================================================
-- Table: conditions
-- FHIR Resource: Condition
-- =============================================================================
CREATE TABLE conditions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    fhir_id             VARCHAR(64)     UNIQUE NOT NULL,
    patient_id          UUID            NOT NULL REFERENCES patients(id),
    code_system         VARCHAR(255),
    code_value          VARCHAR(50),
    code_display        VARCHAR(500)    NOT NULL,
    clinical_status     VARCHAR(50)     NOT NULL,
    verification_status VARCHAR(50),
    severity            VARCHAR(50),
    onset_date          DATE,
    abatement_date      DATE,
    recorded_date       TIMESTAMPTZ     DEFAULT NOW(),
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW(),
    created_by          UUID
);

CREATE INDEX idx_conditions_patient ON conditions (patient_id);
CREATE INDEX idx_conditions_code    ON conditions (code_system, code_value);

-- =============================================================================
-- Table: medication_statements
-- FHIR Resource: MedicationStatement
-- =============================================================================
CREATE TABLE medication_statements (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    fhir_id             VARCHAR(64)     UNIQUE NOT NULL,
    patient_id          UUID            NOT NULL REFERENCES patients(id),
    medication_code     VARCHAR(50),
    medication_system   VARCHAR(255),
    medication_display  VARCHAR(500)    NOT NULL,
    status              VARCHAR(50)     NOT NULL,
    dosage_text         TEXT,
    dosage_route        VARCHAR(100),
    dosage_frequency    VARCHAR(100),
    effective_start     DATE,
    effective_end       DATE,
    source_type         VARCHAR(50),
    prescription_id     UUID,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW(),
    created_by          UUID
);

CREATE INDEX idx_medications_patient ON medication_statements (patient_id);

-- =============================================================================
-- Table: allergy_intolerances
-- FHIR Resource: AllergyIntolerance
-- =============================================================================
CREATE TABLE allergy_intolerances (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    fhir_id                 VARCHAR(64)     UNIQUE NOT NULL,
    patient_id              UUID            NOT NULL REFERENCES patients(id),
    code_system             VARCHAR(255),
    code_value              VARCHAR(50),
    code_display            VARCHAR(500)    NOT NULL,
    clinical_status         VARCHAR(50)     NOT NULL,
    verification_status     VARCHAR(50),
    type                    VARCHAR(50),
    category                VARCHAR(50),
    criticality             VARCHAR(50),
    reaction_manifestation  TEXT,
    reaction_severity       VARCHAR(50),
    onset_date              DATE,
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    created_by              UUID
);

CREATE INDEX idx_allergies_patient ON allergy_intolerances (patient_id);

-- =============================================================================
-- Table: immunizations
-- FHIR Resource: Immunization
-- =============================================================================
CREATE TABLE immunizations (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    fhir_id         VARCHAR(64)     UNIQUE NOT NULL,
    patient_id      UUID            NOT NULL REFERENCES patients(id),
    vaccine_code    VARCHAR(50),
    vaccine_system  VARCHAR(255),
    vaccine_display VARCHAR(500)    NOT NULL,
    status          VARCHAR(50)     NOT NULL,
    occurrence_date DATE            NOT NULL,
    lot_number      VARCHAR(100),
    site_display    VARCHAR(100),
    dose_quantity   DECIMAL(10,2),
    dose_unit       VARCHAR(50),
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW(),
    created_by      UUID
);

CREATE INDEX idx_immunizations_patient ON immunizations (patient_id);

-- =============================================================================
-- Table: prescriptions
-- Stores uploaded prescription images and OCR results
-- =============================================================================
CREATE TABLE prescriptions (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID            NOT NULL REFERENCES patients(id),
    image_url       TEXT            NOT NULL,
    ocr_status      VARCHAR(50)     DEFAULT 'pending',
    ocr_raw_text    TEXT,
    extracted_data  JSONB,
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW(),
    created_by      UUID
);

CREATE INDEX idx_prescriptions_patient ON prescriptions (patient_id);

-- =============================================================================
-- Table: consents
-- FHIR Resource: Consent
-- =============================================================================
CREATE TABLE consents (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID            NOT NULL REFERENCES patients(id),
    consent_type    VARCHAR(100)    NOT NULL,
    status          VARCHAR(50)     NOT NULL,
    granted_to      UUID,
    scope_resources TEXT[],
    period_start    TIMESTAMPTZ,
    period_end      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX idx_consents_patient ON consents (patient_id);

-- =============================================================================
-- Table: emergency_cards
-- Quick-access emergency medical cards with access codes
-- =============================================================================
CREATE TABLE emergency_cards (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id  UUID            NOT NULL REFERENCES patients(id),
    access_code VARCHAR(64)     UNIQUE NOT NULL,
    expires_at  TIMESTAMPTZ     NOT NULL,
    card_data   JSONB           NOT NULL,
    created_at  TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX idx_emergency_cards_code ON emergency_cards (access_code);

-- =============================================================================
-- Table: clinical_notes
-- FHIR Resource: DocumentReference (clinical notes)
-- =============================================================================
CREATE TABLE clinical_notes (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    fhir_id         VARCHAR(64)     UNIQUE NOT NULL,
    patient_id      UUID            NOT NULL REFERENCES patients(id),
    doctor_id       UUID            NOT NULL,
    note_type       VARCHAR(100),
    content         TEXT            NOT NULL,
    encounter_date  TIMESTAMPTZ     DEFAULT NOW(),
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX idx_clinical_notes_patient ON clinical_notes (patient_id);
CREATE INDEX idx_clinical_notes_doctor  ON clinical_notes (doctor_id);

-- =============================================================================
-- Table: audit_log
-- HIPAA-compliant audit trail for all data access
-- =============================================================================
CREATE TABLE audit_log (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL,
    user_role       VARCHAR(50)     NOT NULL,
    action          VARCHAR(50)     NOT NULL,
    resource_type   VARCHAR(100)    NOT NULL,
    resource_id     UUID            NOT NULL,
    patient_id      UUID,
    ip_address      INET,
    user_agent      TEXT,
    details         JSONB,
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX idx_audit_log_patient ON audit_log (patient_id);
CREATE INDEX idx_audit_log_user    ON audit_log (user_id);
CREATE INDEX idx_audit_log_time    ON audit_log (created_at);
