import Redis from 'ioredis';

// Create Redis client using REDIS_URL from environment
export const redis = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});
