import { getDb, auditLog } from '@ananta/db-client';

interface AuditEntry {
  userId: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  patientId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export class AuditService {
  private db = getDb();

  async logAccess(entry: AuditEntry) {
    await this.db.insert(auditLog).values(entry);
  }
}
