import { AgentStatusEnum } from "./AgentStatus";

export interface IAgentProfileDTO {
  agentId: string;
  agentName: string;
  role: string;
  capabilities: string[];
  confidenceScore: number; // 0.0 to 1.0
  costPerCallUsd: number;
  averageLatencyMs: number;
  status: AgentStatusEnum;
  systemPrompt?: string;
  permissions: string[];
  createdAt?: string | Date;
}

export interface IAgentSubtask {
  subtaskId: string;
  capability: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  input: any;
  output?: any;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "WAITING_APPROVAL";
  dependencies: string[];
  confidence?: number;
  durationMs?: number;
  error?: string;
}

export interface IAgentExecutionPlanDTO {
  sessionId: string;
  prompt: string;
  taskGraph: IAgentSubtask[];
  status: "CREATED" | "ORCHESTRATING" | "WAITING_APPROVAL" | "COMPLETED" | "FAILED";
  consensusResult?: any;
  totalCostUsd: number;
  totalDurationMs: number;
  createdAt?: string | Date;
  completedAt?: string | Date;
}

export interface IAgentMemoryDTO {
  memoryId: string;
  sessionId: string;
  key: string;
  value: any;
  sourceAgentId: string;
  tags: string[];
  createdAt?: string | Date;
}

export interface IApprovalRequestDTO {
  approvalId: string;
  sessionId: string;
  capability: string;
  riskScore: number; // 0 to 100
  reason: string;
  requestedByAgentId: string;
  status: "WAITING_APPROVAL" | "APPROVED" | "REJECTED" | "EXPIRED";
  decisionBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IGovernanceEvaluationDTO {
  allowed: boolean;
  requiresApproval: boolean;
  riskScore: number;
  policyViolations: string[];
  maxAllowedSpendUsd: number;
}

export interface IAgentAnalyticsDTO {
  totalAgents: number;
  activeAgents: number;
  orchestratedSessions: number;
  pendingApprovals: number;
  averageAgentLatencyMs: number;
  agentSuccessRate: number;
  governancePassRate: number;
  topAgentRoles: { role: string; callCount: number }[];
}
