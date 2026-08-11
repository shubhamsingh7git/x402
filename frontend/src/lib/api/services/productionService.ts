import { apiClient } from "../axios";
import {
  ApiResponse,
  RegionRecord,
  PerformanceReportRecord,
  DisasterRecoveryValidationRecord,
  ChaosExperimentRecord,
  ReleaseRecord,
  OperationalRunbookRecord,
  ProductionCertificationRecord,
} from "@/types";

export const productionService = {
  getReadiness: async (): Promise<{ score: number; grade: string; checklists: any[] }> => {
    const res = await apiClient.get<ApiResponse<{ score: number; grade: string; checklists: any[] }>>("/production/readiness");
    return res.data?.data || res.data;
  },

  getPerformance: async (): Promise<PerformanceReportRecord> => {
    const res = await apiClient.get<ApiResponse<PerformanceReportRecord>>("/production/performance");
    return res.data?.data || res.data;
  },

  getCapacity: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/production/capacity");
    return res.data?.data || res.data;
  },

  getAvailability: async (): Promise<RegionRecord[]> => {
    const res = await apiClient.get<ApiResponse<RegionRecord[]>>("/production/availability");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getFailover: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>("/production/failover");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getDisasterRecovery: async (): Promise<DisasterRecoveryValidationRecord> => {
    const res = await apiClient.get<ApiResponse<DisasterRecoveryValidationRecord>>("/production/disaster-recovery");
    return res.data?.data || res.data;
  },

  getChaos: async (): Promise<ChaosExperimentRecord[]> => {
    const res = await apiClient.get<ApiResponse<ChaosExperimentRecord[]>>("/production/chaos");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getReleases: async (): Promise<ReleaseRecord[]> => {
    const res = await apiClient.get<ApiResponse<ReleaseRecord[]>>("/production/releases");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getRunbooks: async (): Promise<OperationalRunbookRecord[]> => {
    const res = await apiClient.get<ApiResponse<OperationalRunbookRecord[]>>("/production/runbooks");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getCertification: async (): Promise<ProductionCertificationRecord> => {
    const res = await apiClient.get<ApiResponse<ProductionCertificationRecord>>("/production/certification");
    return res.data?.data || res.data;
  },

  triggerRelease: async (version: string, title: string): Promise<ReleaseRecord> => {
    const res = await apiClient.post<ApiResponse<ReleaseRecord>>("/production/releases", { version, title });
    return res.data?.data || res.data;
  },

  runChaos: async (experimentId: string): Promise<ChaosExperimentRecord> => {
    const res = await apiClient.post<ApiResponse<ChaosExperimentRecord>>("/production/chaos/run", { experimentId });
    return res.data?.data || res.data;
  },

  testFailover: async (policyId: string): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/production/failover/test", { policyId });
    return res.data?.data || res.data;
  },

  testRecovery: async (): Promise<DisasterRecoveryValidationRecord> => {
    const res = await apiClient.post<ApiResponse<DisasterRecoveryValidationRecord>>("/production/recovery/test", {});
    return res.data?.data || res.data;
  },
};
