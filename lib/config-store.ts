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
    // If no data in Redis, return defaults
    return { ...DEFAULT_CONFIG };
  } catch (error) {
    // Fallback to defaults on Redis error
    return { ...DEFAULT_CONFIG };
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
