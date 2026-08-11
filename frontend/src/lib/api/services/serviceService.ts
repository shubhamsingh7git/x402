import { apiClient } from "../axios";
import { ApiResponse, ApiService, PaginatedResponse } from "@/types";

export const serviceService = {
  listServices: async (params?: { search?: string; merchantId?: string; isEnabled?: boolean; page?: number; limit?: number }): Promise<PaginatedResponse<ApiService>> => {
    const res = await apiClient.get("/services", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const rows = Array.isArray(inner?.data)
      ? inner.data
      : Array.isArray(inner?.services)
      ? inner.services
      : Array.isArray(inner)
      ? inner
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    const pagination = inner?.pagination || payload?.pagination || { page: 1, limit: 10, total: rows.length, totalPages: 1 };
    return { success: true, data: rows, pagination };
  },

  getServiceDetails: async (id: string): Promise<ApiService> => {
    const res = await apiClient.get<ApiResponse<ApiService>>(`/services/${id}`);
    return res.data?.data || res.data;
  },

  createService: async (payload: { name: string; serviceId: string; merchantId: string; endpoint: string; pricePerCall: number; capabilities?: string[] }): Promise<ApiService> => {
    const res = await apiClient.post<ApiResponse<ApiService>>("/services", payload);
    return res.data?.data || res.data;
  },

  updateService: async (id: string, payload: Partial<ApiService>): Promise<ApiService> => {
    const res = await apiClient.put<ApiResponse<ApiService>>(`/services/${id}`, payload);
    return res.data?.data || res.data;
  },

  toggleService: async (id: string, isEnabled: boolean): Promise<ApiService> => {
    const res = await apiClient.patch<ApiResponse<ApiService>>(`/services/${id}/toggle`, { isEnabled });
    return res.data?.data || res.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },
};
