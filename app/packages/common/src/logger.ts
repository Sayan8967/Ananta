import pino from 'pino';

export function createLogger(name: string) {
  return pino({
    name,
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    ...(process.env.NODE_ENV === 'development' && {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    }),
  });
}

export const logger = createLogger('ananta');
