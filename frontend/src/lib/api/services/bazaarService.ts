import { apiClient } from "../axios";
import {
  ApiResponse,
  PaginatedResponse,
  ProviderListing,
  Capability,
  BazaarRankedCandidate,
  BazaarOverviewMetrics,
} from "@/types";

export interface BazaarSearchQueryParams {
  capability?: string;
  network?: string;
  merchantVerifiedOnly?: boolean;
  status?: string;
  availability?: boolean;
  merchantId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "rank" | "latency" | "price" | "trust" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const bazaarService = {
  getOverviewMetrics: async (): Promise<BazaarOverviewMetrics> => {
    const res = await apiClient.get<ApiResponse<BazaarOverviewMetrics>>("/bazaar/overview");
    return res.data?.data || res.data;
  },

  listProviders: async (params?: BazaarSearchQueryParams): Promise<PaginatedResponse<ProviderListing>> => {
    const res = await apiClient.get("/bazaar/providers", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const rows = Array.isArray(inner?.data)
      ? inner.data
      : Array.isArray(inner?.providers)
      ? inner.providers
      : Array.isArray(inner)
      ? inner
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    const pagination = inner?.pagination || payload?.pagination || { page: 1, limit: 10, total: rows.length, totalPages: 1 };
    return { success: true, data: rows, pagination };
  },

  getProviderDetails: async (id: string): Promise<ProviderListing> => {
    const res = await apiClient.get<ApiResponse<ProviderListing>>(`/bazaar/providers/${id}`);
    return res.data?.data || res.data;
  },

  createProvider: async (payload: {
    merchantId: string;
    capabilities: string[];
    supportedNetworks?: string[];
    pricePerCall: number;
    currency?: string;
    status?: string;
  }): Promise<ProviderListing> => {
    const res = await apiClient.post<ApiResponse<ProviderListing>>("/bazaar/providers", payload);
    return res.data?.data || res.data;
  },

  updateProvider: async (id: string, payload: Partial<ProviderListing>): Promise<ProviderListing> => {
    const res = await apiClient.put<ApiResponse<ProviderListing>>(`/bazaar/providers/${id}`, payload);
    return res.data?.data || res.data;
  },

  deleteProvider: async (id: string): Promise<void> => {
    await apiClient.delete(`/bazaar/providers/${id}`);
  },

  listCapabilities: async (category?: string): Promise<Capability[]> => {
    const res = await apiClient.get("/bazaar/capabilities", { params: { category } });
    const payload = res.data;
    const rows = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];
    return rows;
  },

  createCapability: async (payload: {
    name: string;
    displayName: string;
    description?: string;
    category: string;
    tags?: string[];
    version?: string;
  }): Promise<Capability> => {
    const res = await apiClient.post<ApiResponse<Capability>>("/bazaar/capabilities", payload);
    return res.data?.data || res.data;
  },

  searchAndRank: async (params?: BazaarSearchQueryParams): Promise<{ success: boolean; total: number; candidates: BazaarRankedCandidate[] }> => {
    const res = await apiClient.get("/bazaar/search", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const candidates = Array.isArray(inner?.candidates) ? inner.candidates : Array.isArray(inner) ? inner : [];
    return {
      success: true,
      total: inner?.total || candidates.length,
      candidates,
    };
  },
};
