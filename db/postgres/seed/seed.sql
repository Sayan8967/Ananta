-- =============================================================================
-- Ananta Healthcare Platform - Seed Data
-- Description: Demo data for the Keycloak demo patient user "Arjun Sharma"
--              with realistic Indian medical records.
-- =============================================================================

-- Fixed UUIDs for reproducibility
-- Patient:              00000000-0000-4000-a000-000000000001
-- Conditions:           00000000-0000-4000-a000-000000000010..12
-- Medication Statements:00000000-0000-4000-a000-000000000020..23
-- Allergy Intolerances: 00000000-0000-4000-a000-000000000030..32
-- Immunizations:        00000000-0000-4000-a000-000000000040..44
-- Emergency Card:       00000000-0000-4000-a000-000000000050
-- Clinical Note:        00000000-0000-4000-a000-000000000060
-- Consent:              00000000-0000-4000-a000-000000000070
-- Demo Doctor:          00000000-0000-4000-a000-0000000000d1

-- =============================================================================
-- Patient: Arjun Sharma
-- =============================================================================
INSERT INTO patients (
    id, fhir_id, active, given_name, family_name, birth_date, gender,
    phone, email, address_line, address_city, address_state,
    address_postal, address_country, blood_type, created_by, version
) VALUES (
    '00000000-0000-4000-a000-000000000001',
    'patient-arjun-sharma-001',
    TRUE,
    'Arjun',
    'Sharma',
    '1990-05-15',
    'male',
    '+91-9876543210',
    'arjun.sharma@example.com',
    '42, Shanti Nagar, Andheri West',
    'Mumbai',
    'Maharashtra',
    '400058',
    'IN',
    'B+',
    '00000000-0000-4000-a000-0000000000d1',
    1
);

-- =============================================================================
-- Conditions (3)
-- =============================================================================

-- Condition 1: Type 2 Diabetes Mellitus (active)
INSERT INTO conditions (
    id, fhir_id, patient_id, code_system, code_value, code_display,
    clinical_status, verification_status, severity,
    onset_date, abatement_date, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000010',
    'condition-arjun-diabetes-001',
    '00000000-0000-4000-a000-000000000001',
    'http://snomed.info/sct',
    '44054006',
    'Type 2 Diabetes Mellitus',
    'active',
    'confirmed',
    'moderate',
    '2018-03-10',
    NULL,
    '00000000-0000-4000-a000-0000000000d1'
);

-- Condition 2: Essential Hypertension (active)
INSERT INTO conditions (
    id, fhir_id, patient_id, code_system, code_value, code_display,
    clinical_status, verification_status, severity,
    onset_date, abatement_date, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000011',
    'condition-arjun-hypertension-001',
    '00000000-0000-4000-a000-000000000001',
    'http://snomed.info/sct',
    '59621000',
    'Essential Hypertension',
    'active',
    'confirmed',
    'mild',
    '2020-07-22',
    NULL,
    '00000000-0000-4000-a000-0000000000d1'
);

-- Condition 3: Seasonal Allergic Rhinitis (resolved)
INSERT INTO conditions (
    id, fhir_id, patient_id, code_system, code_value, code_display,
    clinical_status, verification_status, severity,
    onset_date, abatement_date, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000012',
    'condition-arjun-rhinitis-001',
    '00000000-0000-4000-a000-000000000001',
    'http://snomed.info/sct',
    '367498001',
    'Seasonal Allergic Rhinitis',
    'resolved',
    'confirmed',
    'mild',
    '2023-09-01',
    '2023-11-15',
    '00000000-0000-4000-a000-0000000000d1'
);

-- =============================================================================
-- Medication Statements (4)
-- =============================================================================

-- Medication 1: Metformin 500mg (active - for diabetes)
INSERT INTO medication_statements (
    id, fhir_id, patient_id, medication_code, medication_system,
    medication_display, status, dosage_text, dosage_route,
    dosage_frequency, effective_start, effective_end,
    source_type, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000020',
    'medstmt-arjun-metformin-001',
    '00000000-0000-4000-a000-000000000001',
    '860975',
    'http://www.nlm.nih.gov/research/umls/rxnorm',
    'Metformin 500 mg Oral Tablet',
    'active',
    'Take 1 tablet twice daily with meals',
    'oral',
    'twice daily',
    '2018-03-15',
    NULL,
    'prescription',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Medication 2: Amlodipine 5mg (active - for hypertension)
INSERT INTO medication_statements (
    id, fhir_id, patient_id, medication_code, medication_system,
    medication_display, status, dosage_text, dosage_route,
    dosage_frequency, effective_start, effective_end,
    source_type, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000021',
    'medstmt-arjun-amlodipine-001',
    '00000000-0000-4000-a000-000000000001',
    '329528',
    'http://www.nlm.nih.gov/research/umls/rxnorm',
    'Amlodipine 5 mg Oral Tablet',
    'active',
    'Take 1 tablet once daily in the morning',
    'oral',
    'once daily',
    '2020-08-01',
    NULL,
    'prescription',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Medication 3: Cetirizine 10mg (completed - for allergic rhinitis)
INSERT INTO medication_statements (
    id, fhir_id, patient_id, medication_code, medication_system,
    medication_display, status, dosage_text, dosage_route,
    dosage_frequency, effective_start, effective_end,
    source_type, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000022',
    'medstmt-arjun-cetirizine-001',
    '00000000-0000-4000-a000-000000000001',
    '1014676',
    'http://www.nlm.nih.gov/research/umls/rxnorm',
    'Cetirizine 10 mg Oral Tablet',
    'completed',
    'Take 1 tablet once daily at bedtime',
    'oral',
    'once daily',
    '2023-09-01',
    '2023-11-15',
    'prescription',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Medication 4: Lisinopril 10mg (active - for hypertension, adjunct)
INSERT INTO medication_statements (
    id, fhir_id, patient_id, medication_code, medication_system,
    medication_display, status, dosage_text, dosage_route,
    dosage_frequency, effective_start, effective_end,
    source_type, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000023',
    'medstmt-arjun-lisinopril-001',
    '00000000-0000-4000-a000-000000000001',
    '314076',
    'http://www.nlm.nih.gov/research/umls/rxnorm',
    'Lisinopril 10 mg Oral Tablet',
    'active',
    'Take 1 tablet once daily',
    'oral',
    'once daily',
    '2021-01-10',
    NULL,
    'prescription',
    '00000000-0000-4000-a000-0000000000d1'
);

-- =============================================================================
-- Allergy Intolerances (3)
-- =============================================================================

-- Allergy 1: Penicillin (high criticality)
INSERT INTO allergy_intolerances (
    id, fhir_id, patient_id, code_system, code_value, code_display,
    clinical_status, verification_status, type, category, criticality,
    reaction_manifestation, reaction_severity, onset_date, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000030',
    'allergy-arjun-penicillin-001',
    '00000000-0000-4000-a000-000000000001',
    'http://snomed.info/sct',
    '91936005',
    'Penicillin',
    'active',
    'confirmed',
    'allergy',
    'medication',
    'high',
    'Anaphylaxis, urticaria, angioedema',
    'severe',
    '2005-08-20',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Allergy 2: Peanuts (high criticality)
INSERT INTO allergy_intolerances (
    id, fhir_id, patient_id, code_system, code_value, code_display,
    clinical_status, verification_status, type, category, criticality,
    reaction_manifestation, reaction_severity, onset_date, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000031',
    'allergy-arjun-peanuts-001',
    '00000000-0000-4000-a000-000000000001',
    'http://snomed.info/sct',
    '91935009',
    'Peanuts',
    'active',
    'confirmed',
    'allergy',
    'food',
    'high',
    'Throat swelling, difficulty breathing, hives',
    'severe',
    '1995-06-10',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Allergy 3: Dust Mites (low criticality)
INSERT INTO allergy_intolerances (
    id, fhir_id, patient_id, code_system, code_value, code_display,
    clinical_status, verification_status, type, category, criticality,
    reaction_manifestation, reaction_severity, onset_date, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000032',
    'allergy-arjun-dustmites-001',
    '00000000-0000-4000-a000-000000000001',
    'http://snomed.info/sct',
    '232350006',
    'Dust Mites',
    'active',
    'confirmed',
    'intolerance',
    'environment',
    'low',
    'Sneezing, nasal congestion, watery eyes',
    'mild',
    '2010-03-01',
    '00000000-0000-4000-a000-0000000000d1'
);

-- =============================================================================
-- Immunizations (5)
-- =============================================================================

-- Immunization 1: COVID-19 Covishield (AstraZeneca)
INSERT INTO immunizations (
    id, fhir_id, patient_id, vaccine_code, vaccine_system,
    vaccine_display, status, occurrence_date, lot_number,
    site_display, dose_quantity, dose_unit, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000040',
    'imm-arjun-covid-001',
    '00000000-0000-4000-a000-000000000001',
    '210',
    'http://hl7.org/fhir/sid/cvx',
    'COVID-19 Vaccine (Covishield - AstraZeneca)',
    'completed',
    '2021-05-20',
    'CTMAV521',
    'Left deltoid',
    0.50,
    'mL',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Immunization 2: Hepatitis B
INSERT INTO immunizations (
    id, fhir_id, patient_id, vaccine_code, vaccine_system,
    vaccine_display, status, occurrence_date, lot_number,
    site_display, dose_quantity, dose_unit, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000041',
    'imm-arjun-hepb-001',
    '00000000-0000-4000-a000-000000000001',
    '08',
    'http://hl7.org/fhir/sid/cvx',
    'Hepatitis B Vaccine',
    'completed',
    '1990-06-15',
    'HBV1990-MH',
    'Right deltoid',
    0.50,
    'mL',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Immunization 3: Influenza (Seasonal)
INSERT INTO immunizations (
    id, fhir_id, patient_id, vaccine_code, vaccine_system,
    vaccine_display, status, occurrence_date, lot_number,
    site_display, dose_quantity, dose_unit, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000042',
    'imm-arjun-flu-001',
    '00000000-0000-4000-a000-000000000001',
    '141',
    'http://hl7.org/fhir/sid/cvx',
    'Influenza Vaccine (Seasonal, Injectable)',
    'completed',
    '2024-10-05',
    'FLU2024-SII',
    'Left deltoid',
    0.50,
    'mL',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Immunization 4: Tetanus-Diphtheria (Td Booster)
INSERT INTO immunizations (
    id, fhir_id, patient_id, vaccine_code, vaccine_system,
    vaccine_display, status, occurrence_date, lot_number,
    site_display, dose_quantity, dose_unit, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000043',
    'imm-arjun-tetanus-001',
    '00000000-0000-4000-a000-000000000001',
    '09',
    'http://hl7.org/fhir/sid/cvx',
    'Tetanus-Diphtheria (Td) Booster',
    'completed',
    '2019-12-10',
    'TD2019-BE',
    'Right deltoid',
    0.50,
    'mL',
    '00000000-0000-4000-a000-0000000000d1'
);

-- Immunization 5: MMR (Measles-Mumps-Rubella)
INSERT INTO immunizations (
    id, fhir_id, patient_id, vaccine_code, vaccine_system,
    vaccine_display, status, occurrence_date, lot_number,
    site_display, dose_quantity, dose_unit, created_by
) VALUES (
    '00000000-0000-4000-a000-000000000044',
    'imm-arjun-mmr-001',
    '00000000-0000-4000-a000-000000000001',
    '03',
    'http://hl7.org/fhir/sid/cvx',
    'Measles-Mumps-Rubella (MMR) Vaccine',
    'completed',
    '1991-05-20',
    'MMR1991-SII',
    'Left deltoid',
    0.50,
    'mL',
    '00000000-0000-4000-a000-0000000000d1'
);

-- =============================================================================
-- Emergency Card
-- =============================================================================
INSERT INTO emergency_cards (
    id, patient_id, access_code, expires_at, card_data
) VALUES (
    '00000000-0000-4000-a000-000000000050',
    '00000000-0000-4000-a000-000000000001',
    'DEMO1234',
    '2027-01-01T00:00:00Z',
    '{
        "patientName": "Arjun Sharma",
        "dateOfBirth": "1990-05-15",
        "gender": "male",
        "bloodType": "B+",
        "emergencyPhone": "+91-9876543210",
        "allergies": [
            {"substance": "Penicillin", "criticality": "high", "reaction": "Anaphylaxis"},
            {"substance": "Peanuts", "criticality": "high", "reaction": "Throat swelling"},
            {"substance": "Dust Mites", "criticality": "low", "reaction": "Sneezing"}
        ],
        "activeConditions": [
            {"name": "Type 2 Diabetes Mellitus", "severity": "moderate"},
            {"name": "Essential Hypertension", "severity": "mild"}
        ],
        "currentMedications": [
            {"name": "Metformin 500 mg", "frequency": "twice daily"},
            {"name": "Amlodipine 5 mg", "frequency": "once daily"},
            {"name": "Lisinopril 10 mg", "frequency": "once daily"}
        ],
        "emergencyNotes": "Patient has severe allergy to Penicillin (anaphylaxis risk). Avoid all penicillin-class antibiotics. Patient is on daily diabetes and blood pressure medications."
    }'::jsonb
);

-- =============================================================================
-- Clinical Note
-- =============================================================================
INSERT INTO clinical_notes (
    id, fhir_id, patient_id, doctor_id, note_type, content, encounter_date
) VALUES (
    '00000000-0000-4000-a000-000000000060',
    'note-arjun-annual-001',
    '00000000-0000-4000-a000-000000000001',
    '00000000-0000-4000-a000-0000000000d1',
    'progress-note',
    'Annual wellness check-up. Patient Arjun Sharma, 35-year-old male, presents for routine follow-up.

VITALS: BP 132/84 mmHg, HR 78 bpm, Temp 98.4F, SpO2 98%, Weight 78 kg, Height 175 cm, BMI 25.5.

ASSESSMENT:
1. Type 2 Diabetes Mellitus - HbA1c at 7.2%, slightly above target of 7.0%. Fasting blood glucose 138 mg/dL. Renal function normal (eGFR > 90). No signs of diabetic retinopathy on last eye exam.
2. Essential Hypertension - Blood pressure mildly elevated today. Average home readings 128/82. Current dual therapy with Amlodipine and Lisinopril providing adequate control.
3. Seasonal Allergic Rhinitis - Resolved since November 2023. No recurrence reported.

PLAN:
- Continue Metformin 500 mg BD with meals. Consider dose increase to 1000 mg BD if next HbA1c remains above 7.0%.
- Continue Amlodipine 5 mg OD and Lisinopril 10 mg OD. Recheck BP in 4 weeks.
- Advised dietary modifications: reduce refined carbohydrate intake, increase fibre.
- Recommended 30 minutes of brisk walking daily.
- Lab orders: HbA1c, fasting lipid panel, serum creatinine, urine microalbumin in 3 months.
- Follow-up in 3 months or sooner if symptoms arise.',
    '2025-01-15T10:30:00Z'
);

-- =============================================================================
-- Consent Record
-- =============================================================================
INSERT INTO consents (
    id, patient_id, consent_type, status, granted_to,
    scope_resources, period_start, period_end
) VALUES (
    '00000000-0000-4000-a000-000000000070',
    '00000000-0000-4000-a000-000000000001',
    'emergency-access',
    'active',
    NULL,
    ARRAY['Patient', 'Condition', 'AllergyIntolerance', 'MedicationStatement', 'Immunization'],
    '2025-01-01T00:00:00Z',
    '2026-12-31T23:59:59Z'
);
