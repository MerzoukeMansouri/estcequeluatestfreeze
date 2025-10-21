export interface Config {
  freezeDays: number[];
}

const DEFAULT_CONFIG: Config = {
  freezeDays: [2, 3] // Mardi et Mercredi par défaut
};

// In-memory store (shared within the same lambda instance only)
let configStore: Config = { ...DEFAULT_CONFIG };

// Single source of truth: environment variable > in-memory > defaults
export function getConfig(): Config {
  // Priority 1: Read from environment variable (works across all lambdas on Vercel)
  const envConfig = process.env.FREEZE_DAYS;
  if (envConfig) {
    try {
      const freezeDays = JSON.parse(envConfig);
      if (Array.isArray(freezeDays)) {
        return { freezeDays };
      }
    } catch (error) {
      // Invalid env var, fall through to in-memory
    }
  }

  // Priority 2: In-memory store (only works within same lambda instance)
  return { ...configStore };
}

export function setConfig(newConfig: Config): void {
  // Update in-memory store (only affects current lambda instance)
  configStore = { ...newConfig };
}
