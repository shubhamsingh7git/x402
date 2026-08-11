import { apiClient } from "../axios";
import {
  ApiResponse,
  TraceRecord,
  MetricRecord,
  LogEntryRecord,
  AlertRuleRecord,
  AlertRecord,
  IncidentRecord,
  SloRecord,
  ObservabilityAnalyticsRecord,
} from "@/types";

export const observabilityService = {
  getHealth: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/observability/health");
    return res.data?.data || res.data;
  },

  getMetrics: async (): Promise<MetricRecord[]> => {
    const res = await apiClient.get<ApiResponse<MetricRecord[]>>("/observability/metrics");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getTraces: async (): Promise<TraceRecord[]> => {
    const res = await apiClient.get<ApiResponse<TraceRecord[]>>("/observability/traces");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getTraceById: async (id: string): Promise<TraceRecord> => {
    const res = await apiClient.get<ApiResponse<TraceRecord>>(`/observability/traces/${id}`);
    return res.data?.data || res.data;
  },

  getLogs: async (): Promise<LogEntryRecord[]> => {
    const res = await apiClient.get<ApiResponse<LogEntryRecord[]>>("/observability/logs");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getAlerts: async (): Promise<AlertRecord[]> => {
    const res = await apiClient.get<ApiResponse<AlertRecord[]>>("/observability/alerts");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getAlertRules: async (): Promise<AlertRuleRecord[]> => {
    const res = await apiClient.get<ApiResponse<AlertRuleRecord[]>>("/observability/alert-rules");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getIncidents: async (): Promise<IncidentRecord[]> => {
    const res = await apiClient.get<ApiResponse<IncidentRecord[]>>("/observability/incidents");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  openIncident: async (payload: { title: string; affectedServices: string[]; severity?: string; rootCause?: string }): Promise<IncidentRecord> => {
    const res = await apiClient.post<ApiResponse<IncidentRecord>>("/observability/incidents", payload);
    return res.data?.data || res.data;
  },

  getDependencies: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>("/observability/dependencies");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getSlos: async (): Promise<SloRecord[]> => {
    const res = await apiClient.get<ApiResponse<SloRecord[]>>("/observability/slos");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getDashboard: async (): Promise<ObservabilityAnalyticsRecord> => {
    const res = await apiClient.get<ApiResponse<ObservabilityAnalyticsRecord>>("/observability/dashboard");
    return res.data?.data || res.data;
  },
};
