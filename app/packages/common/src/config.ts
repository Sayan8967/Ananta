export interface AppConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
  database: {
    url: string;
  };
  mongodb: {
    uri: string;
  };
  redis: {
    url: string;
  };
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
    clientSecret?: string;
  };
  s3: {
    bucket: string;
    region: string;
    endpoint?: string;
  };
}

export function loadConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    database: {
      url: process.env.DATABASE_URL || 'postgresql://ananta:ananta_dev_password@localhost:5432/ananta',
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://ananta:ananta_dev_password@localhost:27017/ananta?authSource=admin',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    keycloak: {
      url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.KEYCLOAK_REALM || 'ananta',
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'ananta-backend',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    },
    s3: {
      bucket: process.env.S3_BUCKET || 'ananta-documents-dev',
      region: process.env.AWS_REGION || 'ap-south-1',
      endpoint: process.env.S3_ENDPOINT,
    },
    ...overrides,
  };
}
