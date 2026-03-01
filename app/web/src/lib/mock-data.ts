// =============================================================================
// Ananta Patient Portal - Mock Data
// =============================================================================

export interface PatientData {
  id: string;
  givenName: string;
  familyName: string;
  birthDate: string;
  gender: "male" | "female" | "other" | "unknown";
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  bloodType: string;
  avatarUrl?: string;
}

export interface Condition {
  id: string;
  name: string;
  codeSystem: "SNOMED" | "ICD-10";
  codeValue: string;
  clinicalStatus: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved";
  verificationStatus: "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted";
  severity: "severe" | "moderate" | "mild";
  onsetDate: string;
  abatementDate?: string;
  recordedDate: string;
}

export interface Medication {
  id: string;
  name: string;
  code: string;
  status: "active" | "on-hold" | "cancelled" | "completed" | "stopped";
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export interface Allergy {
  id: string;
  substance: string;
  type: "allergy" | "intolerance";
  category: "food" | "medication" | "environment" | "biologic";
  criticality: "high" | "low" | "unable-to-assess";
  clinicalStatus: "active" | "inactive" | "resolved";
  reaction: string;
  manifestation: string;
  recordedDate: string;
}

export interface Immunization {
  id: string;
  vaccineName: string;
  vaccineCode: string;
  date: string;
  lotNumber: string;
  status: "completed" | "not-done" | "entered-in-error";
  site?: string;
  performer?: string;
}

export interface TimelineEntry {
  id: string;
  category: "condition" | "medication" | "allergy" | "immunization" | "prescription";
  title: string;
  description: string;
  date: string;
  referenceId: string;
}

export interface Prescription {
  id: string;
  fileName: string;
  uploadDate: string;
  status: "pending" | "processing" | "completed" | "failed";
  extractedMedicationsCount: number;
  thumbnailUrl?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface EmergencyCard {
  id: string;
  accessCode: string;
  createdDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Consent {
  id: string;
  type: "treatment" | "research" | "data-sharing" | "emergency-access";
  grantedTo: string;
  grantedToId?: string;
  scope: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Mock Patient
// ---------------------------------------------------------------------------

export const mockPatient: PatientData = {
  id: "patient-001",
  givenName: "Arjun",
  familyName: "Mehta",
  birthDate: "1990-05-15",
  gender: "male",
  phone: "+91-98765-43210",
  email: "arjun.mehta@example.com",
  addressLine: "42, Lotus Residency, MG Road",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560001",
  country: "India",
  bloodType: "B+",
};

// ---------------------------------------------------------------------------
// Mock Conditions
// ---------------------------------------------------------------------------

export const mockConditions: Condition[] = [
  {
    id: "cond-001",
    name: "Type 2 Diabetes Mellitus",
    codeSystem: "ICD-10",
    codeValue: "E11.9",
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    severity: "moderate",
    onsetDate: "2021-03-10",
    recordedDate: "2021-03-15",
  },
  {
    id: "cond-002",
    name: "Essential Hypertension",
    codeSystem: "ICD-10",
    codeValue: "I10",
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    severity: "mild",
    onsetDate: "2022-01-20",
    recordedDate: "2022-01-25",
  },
  {
    id: "cond-003",
    name: "Allergic Rhinitis",
    codeSystem: "SNOMED",
    codeValue: "61582004",
    clinicalStatus: "inactive",
    verificationStatus: "confirmed",
    severity: "mild",
    onsetDate: "2019-09-01",
    abatementDate: "2020-04-15",
    recordedDate: "2019-09-05",
  },
  {
    id: "cond-004",
    name: "Acute Bronchitis",
    codeSystem: "ICD-10",
    codeValue: "J20.9",
    clinicalStatus: "resolved",
    verificationStatus: "confirmed",
    severity: "moderate",
    onsetDate: "2024-12-01",
    abatementDate: "2024-12-20",
    recordedDate: "2024-12-02",
  },
];

// ---------------------------------------------------------------------------
// Mock Medications
// ---------------------------------------------------------------------------

export const mockMedications: Medication[] = [
  {
    id: "med-001",
    name: "Metformin 500mg",
    code: "860975",
    status: "active",
    dosage: "500 mg",
    route: "oral",
    frequency: "Twice daily",
    startDate: "2021-03-15",
  },
  {
    id: "med-002",
    name: "Amlodipine 5mg",
    code: "197361",
    status: "active",
    dosage: "5 mg",
    route: "oral",
    frequency: "Once daily",
    startDate: "2022-02-01",
  },
  {
    id: "med-003",
    name: "Cetirizine 10mg",
    code: "1014676",
    status: "completed",
    dosage: "10 mg",
    route: "oral",
    frequency: "Once daily",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
  },
  {
    id: "med-004",
    name: "Azithromycin 500mg",
    code: "248656",
    status: "completed",
    dosage: "500 mg",
    route: "oral",
    frequency: "Once daily for 3 days",
    startDate: "2024-12-02",
    endDate: "2024-12-05",
  },
  {
    id: "med-005",
    name: "Vitamin D3 60000 IU",
    code: "11253",
    status: "active",
    dosage: "60000 IU",
    route: "oral",
    frequency: "Once weekly",
    startDate: "2025-01-10",
  },
];

// ---------------------------------------------------------------------------
// Mock Allergies
// ---------------------------------------------------------------------------

export const mockAllergies: Allergy[] = [
  {
    id: "allergy-001",
    substance: "Penicillin",
    type: "allergy",
    category: "medication",
    criticality: "high",
    clinicalStatus: "active",
    reaction: "Anaphylaxis",
    manifestation: "Difficulty breathing, hives, swelling",
    recordedDate: "2018-06-20",
  },
  {
    id: "allergy-002",
    substance: "Shellfish",
    type: "allergy",
    category: "food",
    criticality: "high",
    clinicalStatus: "active",
    reaction: "Urticaria",
    manifestation: "Skin rash, itching, gastrointestinal distress",
    recordedDate: "2015-03-10",
  },
  {
    id: "allergy-003",
    substance: "Dust Mites",
    type: "intolerance",
    category: "environment",
    criticality: "low",
    clinicalStatus: "active",
    reaction: "Rhinitis",
    manifestation: "Sneezing, runny nose, watery eyes",
    recordedDate: "2019-08-15",
  },
];

// ---------------------------------------------------------------------------
// Mock Immunizations
// ---------------------------------------------------------------------------

export const mockImmunizations: Immunization[] = [
  {
    id: "imm-001",
    vaccineName: "COVID-19 Vaccine (Covishield)",
    vaccineCode: "207",
    date: "2021-06-15",
    lotNumber: "ABV5811",
    status: "completed",
    site: "Left deltoid",
    performer: "Dr. Priya Sharma",
  },
  {
    id: "imm-002",
    vaccineName: "COVID-19 Vaccine (Covishield) - Dose 2",
    vaccineCode: "207",
    date: "2021-09-10",
    lotNumber: "ABV7623",
    status: "completed",
    site: "Left deltoid",
    performer: "Dr. Priya Sharma",
  },
  {
    id: "imm-003",
    vaccineName: "Influenza Vaccine (2024-25)",
    vaccineCode: "141",
    date: "2024-10-20",
    lotNumber: "FLU2024-892",
    status: "completed",
    site: "Right deltoid",
    performer: "Dr. Anand Kulkarni",
  },
  {
    id: "imm-004",
    vaccineName: "Tdap (Tetanus, Diphtheria, Pertussis)",
    vaccineCode: "115",
    date: "2023-04-05",
    lotNumber: "TDP-3847",
    status: "completed",
    site: "Left deltoid",
    performer: "Dr. Meena Iyer",
  },
  {
    id: "imm-005",
    vaccineName: "Hepatitis B - Booster",
    vaccineCode: "08",
    date: "2022-07-12",
    lotNumber: "HBV-1192",
    status: "completed",
    site: "Right deltoid",
    performer: "Dr. Priya Sharma",
  },
];

// ---------------------------------------------------------------------------
// Mock Timeline Entries
// ---------------------------------------------------------------------------

export const mockTimeline: TimelineEntry[] = [
  {
    id: "tl-001",
    category: "medication",
    title: "Started Vitamin D3 60000 IU",
    description: "Weekly supplementation prescribed due to Vitamin D deficiency.",
    date: "2025-01-10",
    referenceId: "med-005",
  },
  {
    id: "tl-002",
    category: "condition",
    title: "Acute Bronchitis Resolved",
    description: "Condition marked as resolved after completing antibiotic course.",
    date: "2024-12-20",
    referenceId: "cond-004",
  },
  {
    id: "tl-003",
    category: "medication",
    title: "Completed Azithromycin Course",
    description: "3-day course of Azithromycin 500mg for acute bronchitis completed.",
    date: "2024-12-05",
    referenceId: "med-004",
  },
  {
    id: "tl-004",
    category: "condition",
    title: "Diagnosed with Acute Bronchitis",
    description: "Presented with cough, fever, and chest congestion. Prescribed antibiotics.",
    date: "2024-12-01",
    referenceId: "cond-004",
  },
  {
    id: "tl-005",
    category: "immunization",
    title: "Influenza Vaccine (2024-25)",
    description: "Annual influenza vaccination administered by Dr. Anand Kulkarni.",
    date: "2024-10-20",
    referenceId: "imm-003",
  },
  {
    id: "tl-006",
    category: "medication",
    title: "Started Cetirizine 10mg",
    description: "Prescribed for seasonal allergic rhinitis symptoms.",
    date: "2024-09-01",
    referenceId: "med-003",
  },
  {
    id: "tl-007",
    category: "prescription",
    title: "Prescription Uploaded",
    description: "Uploaded prescription from Dr. Priya Sharma. 3 medications extracted.",
    date: "2024-08-15",
    referenceId: "rx-001",
  },
  {
    id: "tl-008",
    category: "immunization",
    title: "Tdap Booster Administered",
    description: "Tetanus, Diphtheria, and Pertussis booster by Dr. Meena Iyer.",
    date: "2023-04-05",
    referenceId: "imm-004",
  },
  {
    id: "tl-009",
    category: "immunization",
    title: "Hepatitis B Booster",
    description: "Hepatitis B booster dose administered by Dr. Priya Sharma.",
    date: "2022-07-12",
    referenceId: "imm-005",
  },
  {
    id: "tl-010",
    category: "medication",
    title: "Started Amlodipine 5mg",
    description: "Prescribed for management of essential hypertension.",
    date: "2022-02-01",
    referenceId: "med-002",
  },
  {
    id: "tl-011",
    category: "condition",
    title: "Diagnosed with Essential Hypertension",
    description: "Blood pressure consistently elevated. Lifestyle changes and medication started.",
    date: "2022-01-20",
    referenceId: "cond-002",
  },
  {
    id: "tl-012",
    category: "medication",
    title: "Started Metformin 500mg",
    description: "Prescribed for Type 2 Diabetes Mellitus management.",
    date: "2021-03-15",
    referenceId: "med-001",
  },
  {
    id: "tl-013",
    category: "condition",
    title: "Diagnosed with Type 2 Diabetes",
    description: "Fasting glucose 142 mg/dL, HbA1c 7.2%. Oral hypoglycemics started.",
    date: "2021-03-10",
    referenceId: "cond-001",
  },
  {
    id: "tl-014",
    category: "allergy",
    title: "Dust Mite Intolerance Recorded",
    description: "Environmental intolerance causing rhinitis symptoms documented.",
    date: "2019-08-15",
    referenceId: "allergy-003",
  },
  {
    id: "tl-015",
    category: "allergy",
    title: "Penicillin Allergy Recorded",
    description: "Severe penicillin allergy (anaphylaxis risk) documented.",
    date: "2018-06-20",
    referenceId: "allergy-001",
  },
];

// ---------------------------------------------------------------------------
// Mock Prescriptions
// ---------------------------------------------------------------------------

export const mockPrescriptions: Prescription[] = [
  {
    id: "rx-001",
    fileName: "prescription_dr_sharma_aug2024.jpg",
    uploadDate: "2024-08-15",
    status: "completed",
    extractedMedicationsCount: 3,
  },
  {
    id: "rx-002",
    fileName: "prescription_dr_kulkarni_dec2024.jpg",
    uploadDate: "2024-12-02",
    status: "completed",
    extractedMedicationsCount: 2,
  },
  {
    id: "rx-003",
    fileName: "prescription_vitd_jan2025.png",
    uploadDate: "2025-01-10",
    status: "processing",
    extractedMedicationsCount: 0,
  },
];

// ---------------------------------------------------------------------------
// Mock Emergency Contacts
// ---------------------------------------------------------------------------

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: "ec-001",
    name: "Sneha Mehta",
    relationship: "Spouse",
    phone: "+91-98765-43211",
  },
  {
    id: "ec-002",
    name: "Rajesh Mehta",
    relationship: "Father",
    phone: "+91-98765-43212",
  },
];

// ---------------------------------------------------------------------------
// Mock Emergency Cards
// ---------------------------------------------------------------------------

export const mockEmergencyCards: EmergencyCard[] = [
  {
    id: "ecard-001",
    accessCode: "ANANTA-AM-7X3K9",
    createdDate: "2025-01-01",
    expiryDate: "2025-07-01",
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Mock Consents
// ---------------------------------------------------------------------------

export const mockConsents: Consent[] = [
  {
    id: "consent-001",
    type: "treatment",
    grantedTo: "Dr. Priya Sharma",
    grantedToId: "doc-001",
    scope: ["Conditions", "Medications", "Allergies"],
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    isActive: true,
  },
  {
    id: "consent-002",
    type: "data-sharing",
    grantedTo: "Dr. Anand Kulkarni",
    grantedToId: "doc-002",
    scope: ["All Records"],
    startDate: "2024-06-01",
    endDate: "2025-06-01",
    isActive: true,
  },
  {
    id: "consent-003",
    type: "emergency-access",
    grantedTo: "General",
    scope: ["Allergies", "Medications", "Conditions"],
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    isActive: true,
  },
  {
    id: "consent-004",
    type: "research",
    grantedTo: "AIIMS Research Institute",
    grantedToId: "org-001",
    scope: ["Conditions", "Immunizations"],
    startDate: "2024-03-01",
    endDate: "2025-03-01",
    isActive: false,
  },
];
