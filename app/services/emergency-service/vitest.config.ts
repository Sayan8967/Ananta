import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@ananta/db-client': path.resolve(__dirname, 'src/__tests__/__mocks__/db-client.ts'),
      '@ananta/auth-client': path.resolve(__dirname, 'src/__tests__/__mocks__/auth-client.ts'),
      '@ananta/common': path.resolve(__dirname, 'src/__tests__/__mocks__/common.ts'),
      '@ananta/fhir-models': path.resolve(__dirname, 'src/__tests__/__mocks__/fhir-models.ts'),
    },
  },
});
