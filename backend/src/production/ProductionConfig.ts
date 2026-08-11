export const PRODUCTION_CONFIG = {
  defaultRpoTargetSeconds: 300,
  defaultRtoTargetSeconds: 900,
  targetAvailabilityPercent: 99.99,
  chaosSimulationDurationSeconds: 60,
  supportedFailoverModes: ["ACTIVE_ACTIVE", "ACTIVE_PASSIVE"],
  performanceProfilingIntervalMs: 15000,
  readinessThresholdScore: 95.0,
};
