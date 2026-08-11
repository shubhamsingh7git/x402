import { apiClient } from "../axios";
import { ApiResponse, HealthStatus } from "@/types";

export const healthService = {
  getHealth: async (): Promise<HealthStatus> => {
    const res = await apiClient.get<ApiResponse<HealthStatus>>("/health");
    return res.data.data;
  },

  getLive: async (): Promise<{ status: string }> => {
    const res = await apiClient.get<ApiResponse<{ status: string }>>("/live");
    return res.data.data;
  },

  getReady: async (): Promise<{ status: string }> => {
    const res = await apiClient.get<ApiResponse<{ status: string }>>("/ready");
    return res.data.data;
  },
};
