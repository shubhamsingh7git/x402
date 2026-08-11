import { apiClient } from "../axios";
import {
  ApiResponse,
  ClusterRecord,
  DeploymentRecord,
  PipelineRecord,
  SbomRecord,
  ArtifactSignatureRecord,
  GitOpsApplicationRecord,
  AutoscalingPolicyRecord,
  BackupPolicyRecord,
  DevOpsAnalyticsRecord,
} from "@/types";

export const devopsService = {
  getClusters: async (): Promise<ClusterRecord[]> => {
    const res = await apiClient.get<ApiResponse<ClusterRecord[]>>("/devops/clusters");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getDeployments: async (): Promise<DeploymentRecord[]> => {
    const res = await apiClient.get<ApiResponse<DeploymentRecord[]>>("/devops/deployments");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getPipelines: async (): Promise<PipelineRecord[]> => {
    const res = await apiClient.get<ApiResponse<PipelineRecord[]>>("/devops/pipelines");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getReleases: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>("/devops/releases");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getGitOps: async (): Promise<GitOpsApplicationRecord[]> => {
    const res = await apiClient.get<ApiResponse<GitOpsApplicationRecord[]>>("/devops/gitops");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getAutoscaling: async (): Promise<AutoscalingPolicyRecord[]> => {
    const res = await apiClient.get<ApiResponse<AutoscalingPolicyRecord[]>>("/devops/autoscaling");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getBackups: async (): Promise<BackupPolicyRecord[]> => {
    const res = await apiClient.get<ApiResponse<BackupPolicyRecord[]>>("/devops/backups");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getDisasterRecovery: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/devops/disaster-recovery");
    return res.data?.data || res.data;
  },

  getSupplyChain: async (): Promise<{ signatures: ArtifactSignatureRecord[]; sboms: SbomRecord[] }> => {
    const res = await apiClient.get<ApiResponse<{ signatures: ArtifactSignatureRecord[]; sboms: SbomRecord[] }>>("/devops/supply-chain");
    return res.data?.data || res.data;
  },

  triggerDeploy: async (deploymentId: string, imageTag: string): Promise<DeploymentRecord> => {
    const res = await apiClient.post<ApiResponse<DeploymentRecord>>("/devops/deploy", { deploymentId, imageTag });
    return res.data?.data || res.data;
  },

  triggerRollback: async (deploymentId: string): Promise<DeploymentRecord> => {
    const res = await apiClient.post<ApiResponse<DeploymentRecord>>("/devops/rollback", { deploymentId });
    return res.data?.data || res.data;
  },

  triggerBackup: async (name: string, targetCluster?: string): Promise<BackupPolicyRecord> => {
    const res = await apiClient.post<ApiResponse<BackupPolicyRecord>>("/devops/backup", { name, targetCluster });
    return res.data?.data || res.data;
  },

  triggerRestore: async (backupId: string): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/devops/restore", { backupId });
    return res.data?.data || res.data;
  },
};
