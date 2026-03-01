import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/postgres/schema.ts',
  out: '../../db/postgres/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://ananta:ananta_dev_password@localhost:5432/ananta',
  },
});
