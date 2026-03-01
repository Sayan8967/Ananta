import { eq } from 'drizzle-orm';
import { getDb, conditions, medicationStatements, allergyIntolerances, immunizations } from '@ananta/db-client';
import type { TimelineEntry } from '@ananta/fhir-models';

interface TimelineQuery {
  from?: string;
  to?: string;
  types?: string[];
  limit: number;
  offset: number;
}

export class TimelineService {
  private db = getDb();

  async getTimeline(patientId: string, query: TimelineQuery) {
    const entries: TimelineEntry[] = [];

    const shouldInclude = (type: string) => !query.types || query.types.includes(type);

    if (shouldInclude('condition')) {
      const conditionRows = await this.db.select().from(conditions)
        .where(eq(conditions.patientId, patientId));
      entries.push(...conditionRows.map(c => ({
        id: c.id,
        resourceType: 'Condition',
        date: c.onsetDate || c.recordedDate?.toISOString().split('T')[0] || c.createdAt?.toISOString().split('T')[0] || '',
        title: c.codeDisplay,
        description: `Status: ${c.clinicalStatus}${c.severity ? `, Severity: ${c.severity}` : ''}`,
        category: 'condition' as const,
        severity: c.severity ?? undefined,
        status: c.clinicalStatus,
      })));
    }

    if (shouldInclude('medication')) {
      const medRows = await this.db.select().from(medicationStatements)
        .where(eq(medicationStatements.patientId, patientId));
      entries.push(...medRows.map(m => ({
        id: m.id,
        resourceType: 'MedicationStatement',
        date: m.effectiveStart || m.createdAt?.toISOString().split('T')[0] || '',
        title: m.medicationDisplay,
        description: m.dosageText ? `${m.dosageText}${m.dosageFrequency ? ` — ${m.dosageFrequency}` : ''}` : undefined,
        category: 'medication' as const,
        status: m.status,
      })));
    }

    if (shouldInclude('allergy')) {
      const allergyRows = await this.db.select().from(allergyIntolerances)
        .where(eq(allergyIntolerances.patientId, patientId));
      entries.push(...allergyRows.map(a => ({
        id: a.id,
        resourceType: 'AllergyIntolerance',
        date: a.onsetDate || a.createdAt?.toISOString().split('T')[0] || '',
        title: a.codeDisplay,
        description: `${a.type || 'allergy'}${a.criticality ? ` — criticality: ${a.criticality}` : ''}`,
        category: 'allergy' as const,
        severity: a.reactionSeverity ?? undefined,
        status: a.clinicalStatus,
      })));
    }

    if (shouldInclude('immunization')) {
      const immRows = await this.db.select().from(immunizations)
        .where(eq(immunizations.patientId, patientId));
      entries.push(...immRows.map(i => ({
        id: i.id,
        resourceType: 'Immunization',
        date: i.occurrenceDate,
        title: i.vaccineDisplay,
        description: i.lotNumber ? `Lot: ${i.lotNumber}` : undefined,
        category: 'immunization' as const,
        status: i.status,
      })));
    }

    // Sort by date descending
    entries.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // Apply pagination
    const total = entries.length;
    const paginated = entries.slice(query.offset, query.offset + query.limit);

    return {
      data: paginated,
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }
}
