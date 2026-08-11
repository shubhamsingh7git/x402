import { apiClient } from "../axios";
import { ApiResponse, DashboardSummary, DashboardCharts } from "@/types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/overview");
    return res.data.data;
  },

  getCharts: async (): Promise<DashboardCharts> => {
    const res = await apiClient.get<ApiResponse<DashboardCharts>>("/dashboard/charts");
    return res.data.data;
  },
};
