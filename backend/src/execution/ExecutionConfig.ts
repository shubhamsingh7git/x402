export const EXECUTION_CONFIG = {
  defaultTimeoutMs: 15 * 1000, // 15 seconds per provider attempt
  maxRetriesPerProvider: 3,
  maxFallbackAttempts: 5,
  maxParallelConcurrency: 5,
  circuitBreaker: {
    failureThreshold: 3, // Open circuit after 3 consecutive failures
    recoveryTimeMs: 60 * 1000, // Half-open after 60 seconds
  },
  consensus: {
    minProvidersForConsensus: 2,
    defaultAgreementThreshold: 0.60, // 60% agreement required
  },
};
