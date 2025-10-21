import { redis } from './redis';

export interface Config {
  freezeDays: number[];
}

const DEFAULT_CONFIG: Config = {
  freezeDays: [2, 3] // Mardi et Mercredi par défaut
};

const REDIS_KEY = 'freeze:config';

// Get configuration from Redis
export async function getConfig(): Promise<Config> {
  try {
    const data = await redis.get(REDIS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.freezeDays)) {
        return parsed;
      }
    }
    // If no data in Redis, return defaults (first time setup)
    return { ...DEFAULT_CONFIG };
  } catch (error) {
    // On Redis error, throw so caller knows there's a problem
    const message = error instanceof Error ? error.message : 'Redis connection failed';
    throw new Error(`Failed to read config from Redis: ${message}`);
  }
}

// Set configuration in Redis
export async function setConfig(newConfig: Config): Promise<void> {
  try {
    await redis.set(REDIS_KEY, JSON.stringify(newConfig));
  } catch (error) {
    throw new Error('Failed to save config to Redis');
  }
}
