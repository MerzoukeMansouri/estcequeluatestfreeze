export interface Config {
  freezeDays: number[];
}

const DEFAULT_CONFIG: Config = {
  freezeDays: [2, 3] // Mardi et Mercredi par défaut
};

// In-memory store for config (resets on each deployment)
let configStore: Config = { ...DEFAULT_CONFIG };

export function getConfig(): Config {
  return { ...configStore };
}

export function setConfig(newConfig: Config): void {
  configStore = { ...newConfig };
}

export function resetConfig(): void {
  configStore = { ...DEFAULT_CONFIG };
}
