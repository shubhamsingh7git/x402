import { ExecutionStateEnum } from "./ExecutionState";

export type ExecutionStrategyType =
  | "SEQUENTIAL"
  | "PARALLEL"
  | "FASTEST"
  | "CHEAPEST"
  | "HIGHEST_TRUST"
  | "BALANCED"
  | "CONSENSUS"
  | "QUORUM";

export interface ExecutionContext {
  sessionId: string;
  runId?: string;
  planId?: string;
  capability: string;
  strategy: ExecutionStrategyType;
  parallelGroupId?: string;
  executionIndex?: number;
  attemptNumber: number;
  maxRetries: number;
  timeoutMs: number;
  metadata?: Record<string, unknown>;
}

export interface ProviderExecutionAttempt {
  attemptId: string;
  providerId: string;
  merchantAlias: string;
  status: "SUCCESS" | "FAILED" | "TIMEOUT" | "CIRCUIT_OPEN" | "PAYMENT_REJECTED";
  durationMs: number;
  output?: any;
  error?: string;
  costUsd: number;
  txHash?: string;
  timestamp: Date | string;
}

export interface ConsensusResult {
  strategy: string;
  agreementScore: number; // 0.0 to 1.0
  confidence: number; // 0 to 100
  finalResult: any;
  participatingProvidersCount: number;
  agreedProvidersCount: number;
  rejectedResponses: any[];
}

export interface ExecutionResult {
  sessionId: string;
  capability: string;
  strategy: ExecutionStrategyType;
  state: ExecutionStateEnum;
  success: boolean;
  finalProviderId?: string;
  finalMerchantAlias?: string;
  output?: any;
  attempts: ProviderExecutionAttempt[];
  fallbackTriggered: boolean;
  fallbackCount: number;
  consensus?: ConsensusResult;
  totalCostUsd: number;
  totalDurationMs: number;
  error?: string;
  startedAt: Date | string;
  completedAt?: Date | string;
}

export interface ProviderHealthStatus {
  providerId: string;
  merchantAlias: string;
  circuitState: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  rollingSuccessRate: number; // percentage 0-100
  averageLatencyMs: number;
  lastFailureAt?: Date | string;
  lastSuccessAt?: Date | string;
}

export interface ExecutionTelemetry {
  activeExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  averageExecutionTimeMs: number;
  averageRetries: number;
  fallbackRate: number;
  parallelExecutions: number;
  providerSuccessRate: number;
  providerFailureRate: number;
  averageLatencyMs: number;
  consensusRate: number;
}
