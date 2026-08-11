export const GATEWAY_CONFIG = {
  defaultVersion: "v1",
  supportedVersions: ["v1", "v2"],
  defaultRateLimitPerMin: 120,
  cacheTtlSeconds: 300,
  responseCacheTtlSeconds: 60,
  circuitBreakerThreshold: 5,
  circuitBreakerResetTimeoutMs: 30000,
  serviceHealthCheckIntervalMs: 15000,
  platformServices: [
    "planner-service",
    "bazaar-service",
    "marketplace-service",
    "agents-service",
    "intelligence-service",
    "controlplane-service",
    "distributed-service",
  ],
};
