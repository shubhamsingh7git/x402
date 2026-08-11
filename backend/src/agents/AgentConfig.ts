export const AGENT_CONFIG = {
  defaultTimeoutMs: 30 * 1000,
  maxParallelSubtasks: 5,
  defaultConfidenceThreshold: 0.70,
  governanceRiskThresholds: {
    LOW_RISK_MAX: 30,
    MEDIUM_RISK_MAX: 70,
    HIGH_RISK_REQUIRE_APPROVAL: 70,
  },
  memoryTTLMs: 24 * 60 * 60 * 1000, // 24 hours
};
