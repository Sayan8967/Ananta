import { eq, and, desc } from 'drizzle-orm';
import {
  getDb,
  patients,
  conditions,
  medicationStatements,
  allergyIntolerances,
  immunizations,
} from '@ananta/db-client';
import { createLogger } from '@ananta/common';

const logger = createLogger('patient-summary-service');

interface CriticalAlert {
  type: 'allergy' | 'condition';
  description: string;
  severity?: string | null;
  criticality?: string | null;
}

interface PatientSummary {
  generatedAt: string;
  patientId: string;
  demographics: {
    name: string;
    birthDate: string;
    gender: string;
    phone: string | null;
    email: string | null;
    bloodType: string | null;
  };
  criticalAlerts: CriticalAlert[];
  activeConditions: {
    id: string;
    code: string;
    display: string;
    severity: string | null;
    onsetDate: string | null;
  }[];
  currentMedications: {
    id: string;
    display: string;
    dosage: string | null;
    frequency: string | null;
    effectiveStart: string | null;
  }[];
  allergies: {
    id: string;
    display: string;
    category: string | null;
    criticality: string | null;
    reaction: string | null;
  }[];
  recentImmunizations: {
    id: string;
    vaccine: string;
    date: string;
    status: string;
  }[];
}

export class PatientSummaryService {
  private db = getDb();

  async generateSummary(patientId: string): Promise<PatientSummary | null> {
    // Fetch patient demographics
    const [patient] = await this.db.select().from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);

    if (!patient) {
      return null;
    }

    // Fetch all data in parallel
    const [
      activeConditions,
      activeMedications,
      allAllergies,
      recentImmunizations,
    ] = await Promise.all([
      this.db.select().from(conditions)
        .where(and(
          eq(conditions.patientId, patientId),
          eq(conditions.clinicalStatus, 'active'),
        )),
      this.db.select().from(medicationStatements)
        .where(and(
          eq(medicationStatements.patientId, patientId),
          eq(medicationStatements.status, 'active'),
        )),
      this.db.select().from(allergyIntolerances)
        .where(eq(allergyIntolerances.patientId, patientId)),
      this.db.select().from(immunizations)
        .where(eq(immunizations.patientId, patientId))
        .orderBy(desc(immunizations.occurrenceDate))
        .limit(10),
    ]);

    // Build critical alerts: high-criticality allergies + severe conditions
    const criticalAlerts: CriticalAlert[] = [];

    for (const allergy of allAllergies) {
      if (allergy.criticality === 'high') {
        criticalAlerts.push({
          type: 'allergy',
          description: allergy.codeDisplay,
          criticality: allergy.criticality,
          severity: allergy.reactionSeverity,
        });
      }
    }

    for (const condition of activeConditions) {
      if (condition.severity === 'severe') {
        criticalAlerts.push({
          type: 'condition',
          description: condition.codeDisplay,
          severity: condition.severity,
        });
      }
    }

    const summary: PatientSummary = {
      generatedAt: new Date().toISOString(),
      patientId,
      demographics: {
        name: `${patient.givenName} ${patient.familyName}`,
        birthDate: patient.birthDate,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        bloodType: patient.bloodType,
      },
      criticalAlerts,
      activeConditions: activeConditions.map(c => ({
        id: c.id,
        code: c.codeValue || '',
        display: c.codeDisplay,
        severity: c.severity,
        onsetDate: c.onsetDate,
      })),
      currentMedications: activeMedications.map(m => ({
        id: m.id,
        display: m.medicationDisplay,
        dosage: m.dosageText,
        frequency: m.dosageFrequency,
        effectiveStart: m.effectiveStart,
      })),
      allergies: allAllergies.map(a => ({
        id: a.id,
        display: a.codeDisplay,
        category: a.category,
        criticality: a.criticality,
        reaction: a.reactionManifestation,
      })),
      recentImmunizations: recentImmunizations.map(i => ({
        id: i.id,
        vaccine: i.vaccineDisplay,
        date: i.occurrenceDate,
        status: i.status,
      })),
    };

    logger.info({ patientId }, 'Patient summary generated');
    return summary;
  }
}
