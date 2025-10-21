import { getConfig, type Config } from './config-store';

/**
 * Gets the current day of week (1=Monday, 7=Sunday)
 * Converts JavaScript's getDay() (0=Sunday, 6=Saturday) to ISO format
 */
export function getCurrentDayOfWeek(): number {
  const now = new Date();
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  return dayOfWeek;
}

/**
 * Checks if the current day is a freeze day
 * @returns true if today is a freeze day, false otherwise
 */
export async function isCurrentlyFreeze(): Promise<boolean> {
  const config = await getConfig();
  const dayOfWeek = getCurrentDayOfWeek();
  return config.freezeDays.includes(dayOfWeek);
}

/**
 * Checks if a specific day is a freeze day
 * @param dayOfWeek - Day of week (1=Monday, 7=Sunday)
 * @param config - Configuration object with freezeDays
 * @returns true if the day is a freeze day, false otherwise
 */
export function isFreezeDay(dayOfWeek: number, config: Config): boolean {
  return config.freezeDays.includes(dayOfWeek);
}
