import { apiClient } from "../axios";
import { ApiResponse, Merchant, MerchantVerificationResult, PaginatedResponse } from "@/types";

export interface MerchantFilterParams {
  search?: string;
  status?: string;
  network?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const merchantService = {
  listMerchants: async (params?: MerchantFilterParams): Promise<PaginatedResponse<Merchant>> => {
    const res = await apiClient.get("/merchants", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const rows = Array.isArray(inner?.data)
      ? inner.data
      : Array.isArray(inner?.merchants)
      ? inner.merchants
      : Array.isArray(inner)
      ? inner
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    const pagination = inner?.pagination || payload?.pagination || { page: 1, limit: 10, total: rows.length, totalPages: 1 };
    return { success: true, data: rows, pagination };
  },

  getMerchantDetails: async (id: string): Promise<{ merchant: Merchant; verificationResult?: MerchantVerificationResult }> => {
    const res = await apiClient.get<ApiResponse<{ merchant: Merchant; verificationResult?: MerchantVerificationResult }>>(`/merchants/${id}`);
    return res.data?.data || res.data;
  },

  createMerchant: async (payload: { alias: string; walletAddress: string; network?: string }): Promise<Merchant> => {
    const res = await apiClient.post<ApiResponse<Merchant>>("/merchants", payload);
    return res.data?.data || res.data;
  },

  updateMerchant: async (id: string, payload: Partial<Merchant>): Promise<Merchant> => {
    const res = await apiClient.put<ApiResponse<Merchant>>(`/merchants/${id}`, payload);
    return res.data?.data || res.data;
  },

  deleteMerchant: async (id: string): Promise<void> => {
    await apiClient.delete(`/merchants/${id}`);
  },

  verifyMerchant: async (id: string, force = false): Promise<MerchantVerificationResult> => {
    const res = await apiClient.post<ApiResponse<MerchantVerificationResult>>(`/merchants/${id}/verify`, { force });
    return res.data?.data || res.data;
  },
};
