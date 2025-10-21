import fs from 'fs';
import path from 'path';

export interface Config {
  freezeDays: number[];
}

const DEFAULT_CONFIG: Config = {
  freezeDays: [2, 3] // Mardi et Mercredi par défaut
};

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

/**
 * Reads config from config.json file (read-only on Vercel)
 * Falls back to defaults if file doesn't exist
 */
export function getConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(fileContents);
    }
  } catch (error) {
    console.error('Failed to read config.json, using defaults:', error);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Updates config.json file (only works in development/writable environments)
 * @throws Error if filesystem is read-only (like on Vercel)
 */
export function setConfig(newConfig: Config): void {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
  } catch (error) {
    throw new Error('Cannot write config in read-only environment');
  }
}
