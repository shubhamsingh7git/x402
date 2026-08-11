import { apiClient } from "../axios";
import {
  ApiResponse,
  AgentProfileRecord,
  AgentExecutionPlanRecord,
  AgentMemoryRecord,
  ApprovalRequestRecord,
  GovernanceEvaluationRecord,
} from "@/types";

export const agentService = {
  getRegistry: async (): Promise<AgentProfileRecord[]> => {
    const res = await apiClient.get<ApiResponse<AgentProfileRecord[]>>("/agents/registry");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  registerAgent: async (payload: Partial<AgentProfileRecord>): Promise<AgentProfileRecord> => {
    const res = await apiClient.post<ApiResponse<AgentProfileRecord>>("/agents/registry", payload);
    return res.data?.data || res.data;
  },

  orchestrateSession: async (prompt: string): Promise<AgentExecutionPlanRecord> => {
    const res = await apiClient.post<ApiResponse<AgentExecutionPlanRecord>>("/agents/orchestrate", { prompt });
    return res.data?.data || res.data;
  },

  getExecutions: async (limit = 50): Promise<AgentExecutionPlanRecord[]> => {
    const res = await apiClient.get<ApiResponse<AgentExecutionPlanRecord[]>>("/agents/executions", { params: { limit } });
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getExecutionById: async (id: string): Promise<AgentExecutionPlanRecord> => {
    const res = await apiClient.get<ApiResponse<AgentExecutionPlanRecord>>(`/agents/executions/${id}`);
    return res.data?.data || res.data;
  },

  getSessionMemory: async (sessionId: string): Promise<AgentMemoryRecord[]> => {
    const res = await apiClient.get<ApiResponse<AgentMemoryRecord[]>>(`/agents/memory/${sessionId}`);
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getApprovals: async (): Promise<ApprovalRequestRecord[]> => {
    const res = await apiClient.get<ApiResponse<ApprovalRequestRecord[]>>("/agents/approvals");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  processApprovalAction: async (id: string, action: "APPROVE" | "REJECT"): Promise<ApprovalRequestRecord> => {
    const res = await apiClient.post<ApiResponse<ApprovalRequestRecord>>(`/agents/approvals/${id}/action`, { action });
    return res.data?.data || res.data;
  },

  evaluateGovernance: async (capability: string): Promise<GovernanceEvaluationRecord> => {
    const res = await apiClient.post<ApiResponse<GovernanceEvaluationRecord>>("/agents/governance/evaluate", { capability });
    return res.data?.data || res.data;
  },
};
