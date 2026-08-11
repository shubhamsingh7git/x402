import { apiClient } from "../axios";
import {
  ApiResponse,
  ProviderProfileRecord,
  ReviewRecord,
  MarketplaceAnalyticsRecord,
} from "@/types";

export const marketplaceService = {
  searchProviders: async (params?: { category?: string; capability?: string; q?: string; status?: string; limit?: number; skip?: number }): Promise<{ items: ProviderProfileRecord[]; total: number }> => {
    const res = await apiClient.get<ApiResponse<{ items: ProviderProfileRecord[]; total: number }>>("/marketplace/search", { params });
    return res.data?.data || { items: [], total: 0 };
  },

  getProviderById: async (id: string): Promise<{ profile: ProviderProfileRecord; pricingModel: any; slaProfile: any; reputation: any; reviews: ReviewRecord[] }> => {
    const res = await apiClient.get<ApiResponse<any>>(`/marketplace/providers/${id}`);
    return res.data?.data || res.data;
  },

  createProvider: async (payload: Partial<ProviderProfileRecord>): Promise<ProviderProfileRecord> => {
    const res = await apiClient.post<ApiResponse<ProviderProfileRecord>>("/marketplace/providers", payload);
    return res.data?.data || res.data;
  },

  updateStatus: async (id: string, status: string): Promise<ProviderProfileRecord> => {
    const res = await apiClient.patch<ApiResponse<ProviderProfileRecord>>(`/marketplace/providers/${id}/status`, { status });
    return res.data?.data || res.data;
  },

  addReview: async (payload: { providerId: string; rating: number; title: string; comment: string }): Promise<ReviewRecord> => {
    const res = await apiClient.post<ApiResponse<ReviewRecord>>("/marketplace/reviews", payload);
    return res.data?.data || res.data;
  },

  getAnalytics: async (): Promise<MarketplaceAnalyticsRecord> => {
    const res = await apiClient.get<ApiResponse<MarketplaceAnalyticsRecord>>("/marketplace/analytics");
    return res.data?.data || res.data;
  },
};
