export const OBSERVABILITY_CONFIG = {
  defaultTraceSampleRate: 1.0,
  defaultLogRetentionDays: 30,
  metricsAggregationIntervalMs: 10000,
  healthCheckIntervalMs: 15000,
  logLevels: ["INFO", "WARN", "ERROR", "DEBUG", "AUDIT", "SECURITY"],
  alertSeverities: ["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"],
  incidentStatuses: ["OPEN", "ACKNOWLEDGED", "INVESTIGATING", "MITIGATED", "RESOLVED", "CLOSED"],
};
