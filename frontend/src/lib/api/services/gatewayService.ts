import { apiClient } from "../axios";
import {
  ApiResponse,
  ServiceRegistryRecord,
  RouteDefinitionRecord,
  GatewayPolicyRecord,
  GatewayAnalyticsRecord,
} from "@/types";

export const gatewayService = {
  getServices: async (): Promise<ServiceRegistryRecord[]> => {
    const res = await apiClient.get<ApiResponse<ServiceRegistryRecord[]>>("/gateway/services");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getRoutes: async (): Promise<RouteDefinitionRecord[]> => {
    const res = await apiClient.get<ApiResponse<RouteDefinitionRecord[]>>("/gateway/routes");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getPolicies: async (): Promise<GatewayPolicyRecord[]> => {
    const res = await apiClient.get<ApiResponse<GatewayPolicyRecord[]>>("/gateway/policies");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getMetrics: async (): Promise<GatewayAnalyticsRecord> => {
    const res = await apiClient.get<ApiResponse<GatewayAnalyticsRecord>>("/gateway/metrics");
    return res.data?.data || res.data;
  },

  reloadConfiguration: async (): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/gateway/reload");
    return res.data?.data || res.data;
  },

  clearCache: async (): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/gateway/cache/clear");
    return res.data?.data || res.data;
  },

  getHealth: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/gateway/health");
    return res.data?.data || res.data;
  },

  getDiscovery: async (): Promise<ServiceRegistryRecord[]> => {
    const res = await apiClient.get<ApiResponse<ServiceRegistryRecord[]>>("/gateway/discovery");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },
};
