import { IBazaarProviderListing } from "../bazaar/BazaarTypes";

export interface PlannerCapability {
  name: string;
  displayName: string;
  category: string;
  required: boolean;
  estimatedComplexity: "LOW" | "MEDIUM" | "HIGH";
  suggestedAlternatives?: string[];
}

export interface PlannerCapabilityPlan {
  prompt: string;
  requiredCapabilities: PlannerCapability[];
  estimatedTotalCost: number;
  estimatedProvidersCount: number;
  estimatedPlanningTimeMs: number;
  fromCache?: boolean;
}

export interface SelectionExplanation {
  selectedProviderId: string;
  merchantAlias: string;
  capability: string;
  plannerScore: number;
  selectionReason: string;
  rankingBreakdown: {
    capabilityMatchScore: number;
    verificationScore: number;
    trustScore: number;
    latencyScore: number;
    priceScore: number;
    compositeScore: number;
  };
  rejectedProvidersCount: number;
  estimatedCost: number;
  estimatedLatencyMs: number;
}

export interface ExecutionProviderStep {
  stepId: number;
  title: string;
  capability: string;
  provider: {
    id: string;
    providerId: string;
    merchantId: string;
    merchantAlias: string;
    walletAddress: string;
    isVerified: boolean;
    trustScore: number;
    pricePerCall: number;
    supportedNetworks: string[];
  };
  explanation: SelectionExplanation;
  inputParams?: Record<string, unknown>;
  status: "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED" | "UNRESOLVED";
}

export interface PlannerExecutionPlan {
  planId: string;
  prompt: string;
  status: "RESOLVED" | "UNRESOLVED_CAPABILITIES" | "FAILED";
  capabilities: PlannerCapability[];
  steps: ExecutionProviderStep[];
  unresolvedCapabilities?: Array<{
    capability: string;
    reason: string;
    suggestedAlternatives?: string[];
  }>;
  summary: {
    totalSteps: number;
    resolvedSteps: number;
    unresolvedSteps: number;
    estimatedCostUsd: number;
    estimatedLatencyMs: number;
    averageConfidenceScore: number;
    planningDurationMs: number;
  };
  createdAt: string | Date;
}

// Future Compatibility Interfaces
export interface IFallbackProviderSpec {
  capability: string;
  primaryProviderId: string;
  fallbackProviderId: string;
}

export interface IConsensusSpec {
  capability: string;
  providerIds: string[];
  votingStrategy: "MAJORITY" | "WEIGHTED_AVERAGE";
}
