export const INTELLIGENCE_CONFIG = {
  defaultPageSize: 20,
  memoryExpirationDays: 90,
  defaultConfidenceThreshold: 0.75,
  embeddingDimension: 384, // Standard vector dimension
  categories: ["OPERATIONAL", "COST", "QUALITY", "SECURITY", "GOVERNANCE", "MARKETPLACE"],
  nodeTypes: ["PROVIDER", "CAPABILITY", "AGENT", "USER", "POLICY", "EXECUTION", "ORGANIZATION"],
  edgeTypes: ["OFFERS_CAPABILITY", "USES_PROVIDER", "ENFORCES_POLICY", "DEPENDS_ON", "ROUTED_TO"],
};
