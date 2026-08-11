import { apiClient } from "../axios";
import {
  ApiResponse,
  ExecutionSessionRecord,
  ExecutionTelemetry,
} from "@/types";

export const executionService = {
  getTelemetryMetrics: async (): Promise<ExecutionTelemetry> => {
    const res = await apiClient.get<ApiResponse<ExecutionTelemetry>>("/execution/metrics");
    return res.data?.data || res.data;
  },

  getExecutionHistory: async (limit = 50): Promise<ExecutionSessionRecord[]> => {
    const res = await apiClient.get<ApiResponse<ExecutionSessionRecord[]>>("/execution/history", { params: { limit } });
    const payload = res.data;
    const rows = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];
    return rows;
  },

  getSessionById: async (id: string): Promise<ExecutionSessionRecord> => {
    const res = await apiClient.get<ApiResponse<ExecutionSessionRecord>>(`/execution/${id}`);
    return res.data?.data || res.data;
  },

  runTestExecution: async (payload: { capability: string; strategy?: string }): Promise<ExecutionSessionRecord> => {
    const res = await apiClient.post<ApiResponse<ExecutionSessionRecord>>("/execution/test", payload);
    return res.data?.data || res.data;
  },
};
