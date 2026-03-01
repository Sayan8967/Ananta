import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { eq, and, gt } from 'drizzle-orm';
import {
  getDb,
  patients,
  conditions,
  medicationStatements,
  allergyIntolerances,
  emergencyCards,
} from '@ananta/db-client';
import { getRedis } from '@ananta/db-client';
import { createLogger } from '@ananta/common';

const logger = createLogger('emergency-card-service');

const CARD_TTL_HOURS = 24;
const REDIS_PREFIX = 'emergency-card:';

interface EmergencyCardData {
  patientName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string | null;
  emergencyContacts: {
    phone: string | null;
    email: string | null;
  };
  allergies: {
    display: string;
    category: string | null;
    criticality: string | null;
    reaction: string | null;
  }[];
  activeConditions: {
    display: string;
    severity: string | null;
    onsetDate: string | null;
  }[];
  currentMedications: {
    display: string;
    dosage: string | null;
    frequency: string | null;
  }[];
}

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(12);
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export class EmergencyCardService {
  private db = getDb();

  async generateCard(patientId: string) {
    // Fetch patient data
    const [patient] = await this.db.select().from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);

    if (!patient) {
      throw Object.assign(new Error('Patient not found'), { statusCode: 404, code: 'NOT_FOUND' });
    }

    // Fetch clinical data in parallel
    const [allAllergies, activeConditions, activeMedications] = await Promise.all([
      this.db.select().from(allergyIntolerances)
        .where(eq(allergyIntolerances.patientId, patientId)),
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
    ]);

    // Build card data snapshot
    const cardData: EmergencyCardData = {
      patientName: `${patient.givenName} ${patient.familyName}`,
      dateOfBirth: patient.birthDate,
      gender: patient.gender,
      bloodType: patient.bloodType,
      emergencyContacts: {
        phone: patient.phone,
        email: patient.email,
      },
      allergies: allAllergies.map(a => ({
        display: a.codeDisplay,
        category: a.category,
        criticality: a.criticality,
        reaction: a.reactionManifestation,
      })),
      activeConditions: activeConditions.map(c => ({
        display: c.codeDisplay,
        severity: c.severity,
        onsetDate: c.onsetDate,
      })),
      currentMedications: activeMedications.map(m => ({
        display: m.medicationDisplay,
        dosage: m.dosageText,
        frequency: m.dosageFrequency,
      })),
    };

    // Generate access code and expiry
    const accessCode = generateAccessCode();
    const expiresAt = new Date(Date.now() + CARD_TTL_HOURS * 60 * 60 * 1000);

    // Store in PostgreSQL
    const [card] = await this.db.insert(emergencyCards).values({
      patientId,
      accessCode,
      expiresAt,
      cardData,
    }).returning();

    // Cache in Redis for fast access
    try {
      const redis = getRedis();
      await redis.setex(
        `${REDIS_PREFIX}${accessCode}`,
        CARD_TTL_HOURS * 60 * 60,
        JSON.stringify({
          id: card.id,
          cardData,
          expiresAt: expiresAt.toISOString(),
        }),
      );
    } catch (err) {
      logger.warn({ err }, 'Failed to cache emergency card in Redis, falling back to DB');
    }

    logger.info({ cardId: card.id, patientId, accessCode }, 'Emergency card generated');

    return {
      id: card.id,
      accessCode,
      expiresAt: expiresAt.toISOString(),
      cardData,
    };
  }

  async getByAccessCode(accessCode: string) {
    // Check Redis cache first
    try {
      const redis = getRedis();
      const cached = await redis.get(`${REDIS_PREFIX}${accessCode}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (new Date(parsed.expiresAt) > new Date()) {
          logger.info({ accessCode }, 'Emergency card served from cache');
          return {
            id: parsed.id,
            cardData: parsed.cardData,
            expiresAt: parsed.expiresAt,
          };
        }
        // Expired in cache, clean up
        await redis.del(`${REDIS_PREFIX}${accessCode}`);
      }
    } catch (err) {
      logger.warn({ err }, 'Redis cache lookup failed, falling back to DB');
    }

    // Fall back to database
    const [card] = await this.db.select().from(emergencyCards)
      .where(and(
        eq(emergencyCards.accessCode, accessCode),
        gt(emergencyCards.expiresAt, new Date()),
      ))
      .limit(1);

    if (!card) {
      return null;
    }

    // Re-cache in Redis
    try {
      const redis = getRedis();
      const ttlSeconds = Math.floor((card.expiresAt.getTime() - Date.now()) / 1000);
      if (ttlSeconds > 0) {
        await redis.setex(
          `${REDIS_PREFIX}${accessCode}`,
          ttlSeconds,
          JSON.stringify({
            id: card.id,
            cardData: card.cardData,
            expiresAt: card.expiresAt.toISOString(),
          }),
        );
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to re-cache emergency card in Redis');
    }

    return {
      id: card.id,
      cardData: card.cardData,
      expiresAt: card.expiresAt.toISOString(),
    };
  }

  async revokeCard(cardId: string) {
    const [card] = await this.db.delete(emergencyCards)
      .where(eq(emergencyCards.id, cardId))
      .returning();

    if (card) {
      // Remove from Redis cache
      try {
        const redis = getRedis();
        await redis.del(`${REDIS_PREFIX}${card.accessCode}`);
      } catch (err) {
        logger.warn({ err }, 'Failed to remove emergency card from Redis cache');
      }

      logger.info({ cardId, accessCode: card.accessCode }, 'Emergency card revoked');
    }
  }
}
