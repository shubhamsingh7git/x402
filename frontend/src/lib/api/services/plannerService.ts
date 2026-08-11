import { apiClient } from "../axios";
import { ApiResponse, PlannerExecutionPlan } from "@/types";

export const plannerService = {
  analyzeAndPlan: async (prompt: string): Promise<PlannerExecutionPlan> => {
    const res = await apiClient.post<ApiResponse<PlannerExecutionPlan>>("/planner/analyze", { prompt });
    return res.data?.data || res.data;
  },
};
