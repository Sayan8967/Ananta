import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function getDb(connectionString?: string) {
  if (!db) {
    const url = connectionString || process.env.DATABASE_URL || 'postgresql://ananta:ananta_dev_password@localhost:5432/ananta';
    client = postgres(url, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client, { schema });
  }
  return db;
}

export async function closeDb() {
  if (client) {
    await client.end();
    client = null;
    db = null;
  }
}

export type Database = ReturnType<typeof getDb>;
