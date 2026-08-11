import { apiClient } from "../axios";
import { ApiResponse, AgentRun, ResearchPlanStep, TimelineEvent } from "@/types";

export const researchService = {
  generatePlan: async (query: string): Promise<{ runId: string; plan: ResearchPlanStep[] }> => {
    const res = await apiClient.post<ApiResponse<{ runId: string; plan: ResearchPlanStep[] }>>("/research/plan", { query });
    return res.data.data;
  },

  executePlan: async (runId: string, plan: ResearchPlanStep[]): Promise<{ runId: string; results: any; totalCost: number }> => {
    const res = await apiClient.post<ApiResponse<{ runId: string; results: any; totalCost: number }>>("/research/execute", { runId, plan });
    return res.data.data;
  },

  listRuns: async (): Promise<AgentRun[]> => {
    const res = await apiClient.get<ApiResponse<AgentRun[]>>("/research/runs");
    return res.data.data;
  },

  getRunDetails: async (id: string): Promise<{ run: AgentRun; timeline: TimelineEvent[] }> => {
    const res = await apiClient.get<ApiResponse<{ run: AgentRun; timeline: TimelineEvent[] }>>(`/research/runs/${id}`);
    return res.data.data;
  },

  getTimeline: async (runId: string): Promise<TimelineEvent[]> => {
    const res = await apiClient.get<ApiResponse<TimelineEvent[]>>(`/timeline/run/${runId}`);
    return res.data.data;
  },
};
