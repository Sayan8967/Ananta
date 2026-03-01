import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedis(url?: string): Redis {
  if (!redisClient) {
    const redisUrl = url || process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
