export interface IPlannerWeights {
  capabilityMatch: number;
  merchantVerification: number;
  trustScore: number;
  latencySla: number;
  priceCompetitiveness: number;
  successRate: number;
  availability: number;
}

export const DEFAULT_PLANNER_WEIGHTS: IPlannerWeights = {
  capabilityMatch: 0.30,
  merchantVerification: 0.20,
  trustScore: 0.15,
  latencySla: 0.15,
  priceCompetitiveness: 0.10,
  successRate: 0.10,
  availability: 1.0,
};

export const PLANNER_CONFIG = {
  weights: DEFAULT_PLANNER_WEIGHTS,
  cacheTtlMs: 5 * 60 * 1000, // 5 minutes in-memory analysis cache
  maxPromptLength: 2000,
  defaultCurrency: "USDC",
  maxProvidersPerStep: 3,
};
