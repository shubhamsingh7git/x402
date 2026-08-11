import { apiClient } from "../axios";
import {
  ApiResponse,
  SessionRecord,
  AuthorizationPolicyRecord,
  ComplianceReportRecord,
  ThreatEventRecord,
  SecurityIncidentRecord,
  SecurityAnalyticsRecord,
} from "@/types";

export const securityService = {
  getHealth: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/security/health");
    return res.data?.data || res.data;
  },

  getSessions: async (): Promise<SessionRecord[]> => {
    const res = await apiClient.get<ApiResponse<SessionRecord[]>>("/security/sessions");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  mfaSetup: async (): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/security/mfa", {});
    return res.data?.data || res.data;
  },

  revokeSession: async (sessionId: string): Promise<SessionRecord> => {
    const res = await apiClient.post<ApiResponse<SessionRecord>>("/security/revoke-session", { sessionId });
    return res.data?.data || res.data;
  },

  getPolicies: async (): Promise<AuthorizationPolicyRecord[]> => {
    const res = await apiClient.get<ApiResponse<AuthorizationPolicyRecord[]>>("/security/policies");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getCompliance: async (): Promise<ComplianceReportRecord[]> => {
    const res = await apiClient.get<ApiResponse<ComplianceReportRecord[]>>("/security/compliance");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getThreats: async (): Promise<ThreatEventRecord[]> => {
    const res = await apiClient.get<ApiResponse<ThreatEventRecord[]>>("/security/threats");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getIncidents: async (): Promise<SecurityIncidentRecord[]> => {
    const res = await apiClient.get<ApiResponse<SecurityIncidentRecord[]>>("/security/incidents");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getReports: async (): Promise<ComplianceReportRecord[]> => {
    const res = await apiClient.get<ApiResponse<ComplianceReportRecord[]>>("/security/reports");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  rotateKeys: async (): Promise<{ keyVersion: string }> => {
    const res = await apiClient.post<ApiResponse<{ keyVersion: string }>>("/security/keys/rotate", {});
    return res.data?.data || res.data;
  },
};
