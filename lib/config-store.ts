export interface Config {
  freezeDays: number[];
}

const DEFAULT_CONFIG: Config = {
  freezeDays: [2, 3] // Mardi et Mercredi par défaut
};

// In-memory store - single source of truth
let configStore: Config = { ...DEFAULT_CONFIG };

export function getConfig(): Config {
  return { ...configStore };
}

export function setConfig(newConfig: Config): void {
  configStore = { ...newConfig };
}
