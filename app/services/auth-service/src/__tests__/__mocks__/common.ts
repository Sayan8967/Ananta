export const createLogger = (_name: string) => ({
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
  child: () => createLogger('child'),
});

export class AppError extends Error {
  constructor(message: string, public code: string, public statusCode: number) {
    super(message);
  }
}
