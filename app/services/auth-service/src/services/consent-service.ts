import { eq } from 'drizzle-orm';
import { getDb, consents, type NewConsent } from '@ananta/db-client';

export class ConsentService {
  private db = getDb();

  async create(patientId: string, data: Omit<NewConsent, 'id' | 'patientId' | 'status' | 'createdAt' | 'updatedAt'>) {
    const [consent] = await this.db.insert(consents).values({
      ...data,
      patientId,
      status: 'active',
      periodStart: data.periodStart ? new Date(data.periodStart) : undefined,
      periodEnd: data.periodEnd ? new Date(data.periodEnd) : undefined,
    }).returning();
    return consent;
  }

  async listByPatient(patientId: string) {
    return this.db.select().from(consents).where(eq(consents.patientId, patientId));
  }

  async update(id: string, data: Partial<NewConsent>) {
    const [consent] = await this.db.update(consents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(consents.id, id))
      .returning();
    return consent || null;
  }

  async revoke(id: string) {
    await this.db.update(consents)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(consents.id, id));
  }
}
