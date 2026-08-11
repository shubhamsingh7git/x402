import { AgentStatus } from "../constants/status";

export interface IAgentStep {
  id: number;
  title?: string;
  type: string;
  status: AgentStatus | "RUNNING" | "SKIPPED";
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  estimatedCost?: number;
  actualCost?: number;
  cost?: number;
  retryCount?: number;
}

export interface ITimelineItem {
  runId: string;
  stepId?: number;
  event: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IAgentRun {
  _id: string;
  query: string;
  status: AgentStatus;
  plannerModel?: string;
  executionVersion?: string;
  totalCost: number;
  estimatedCost?: number;
  actualCost?: number;
  totalDuration?: number;
  duration: number;
  steps: IAgentStep[];
  timeline?: ITimelineItem[];
  userId?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
