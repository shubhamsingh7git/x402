import { apiClient } from "../axios";
import { ApiResponse, SpendPolicy, PaginatedResponse } from "@/types";

export const policyService = {
  listPolicies: async (params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<SpendPolicy>> => {
    const res = await apiClient.get("/policies", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const rows = Array.isArray(inner?.data)
      ? inner.data
      : Array.isArray(inner?.policies)
      ? inner.policies
      : Array.isArray(inner)
      ? inner
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    const pagination = inner?.pagination || payload?.pagination || { page: 1, limit: 10, total: rows.length, totalPages: 1 };
    return { success: true, data: rows, pagination };
  },

  getPolicyDetails: async (id: string): Promise<SpendPolicy> => {
    const res = await apiClient.get<ApiResponse<SpendPolicy>>(`/policies/${id}`);
    return res.data?.data || res.data;
  },

  createPolicy: async (payload: { merchantId: string; dailyBudget: number; transactionLimit: number; maxTxPerMinute?: number }): Promise<SpendPolicy> => {
    const res = await apiClient.post<ApiResponse<SpendPolicy>>("/policies", payload);
    return res.data?.data || res.data;
  },

  updatePolicy: async (id: string, payload: Partial<SpendPolicy>): Promise<SpendPolicy> => {
    const res = await apiClient.put<ApiResponse<SpendPolicy>>(`/policies/${id}`, payload);
    return res.data?.data || res.data;
  },

  togglePolicy: async (id: string, isEnabled: boolean): Promise<SpendPolicy> => {
    const res = await apiClient.patch<ApiResponse<SpendPolicy>>(`/policies/${id}/toggle`, { isEnabled });
    return res.data?.data || res.data;
  },

  toggleKillSwitch: async (id: string, killSwitch: boolean): Promise<SpendPolicy> => {
    const res = await apiClient.patch<ApiResponse<SpendPolicy>>(`/policies/${id}/kill-switch`, { killSwitch });
    return res.data?.data || res.data;
  },
};
