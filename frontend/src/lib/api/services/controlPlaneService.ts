import { apiClient } from "../axios";
import {
  ApiResponse,
  OrganizationRecord,
  WorkspaceRecord,
  ProjectRecord,
  TeamRecord,
  RoleRecord,
  APIKeyRecord,
  SecretRecord,
  FeatureFlagRecord,
  QuotaPolicyRecord,
} from "@/types";

export const controlPlaneService = {
  getOrganizations: async (): Promise<OrganizationRecord[]> => {
    const res = await apiClient.get<ApiResponse<OrganizationRecord[]>>("/control-plane/organizations");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createOrganization: async (payload: { name: string; slug: string }): Promise<OrganizationRecord> => {
    const res = await apiClient.post<ApiResponse<OrganizationRecord>>("/control-plane/organizations", payload);
    return res.data?.data || res.data;
  },

  getWorkspaces: async (organizationId?: string): Promise<WorkspaceRecord[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceRecord[]>>("/control-plane/workspaces", { params: { organizationId } });
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createWorkspace: async (payload: { organizationId: string; name: string; slug: string }): Promise<WorkspaceRecord> => {
    const res = await apiClient.post<ApiResponse<WorkspaceRecord>>("/control-plane/workspaces", payload);
    return res.data?.data || res.data;
  },

  getProjects: async (workspaceId?: string): Promise<ProjectRecord[]> => {
    const res = await apiClient.get<ApiResponse<ProjectRecord[]>>("/control-plane/projects", { params: { workspaceId } });
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createProject: async (payload: { organizationId: string; workspaceId: string; name: string }): Promise<ProjectRecord> => {
    const res = await apiClient.post<ApiResponse<ProjectRecord>>("/control-plane/projects", payload);
    return res.data?.data || res.data;
  },

  getTeams: async (): Promise<TeamRecord[]> => {
    const res = await apiClient.get<ApiResponse<TeamRecord[]>>("/control-plane/teams");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createTeam: async (payload: { organizationId: string; name: string; description?: string }): Promise<TeamRecord> => {
    const res = await apiClient.post<ApiResponse<TeamRecord>>("/control-plane/teams", payload);
    return res.data?.data || res.data;
  },

  getRoles: async (): Promise<RoleRecord[]> => {
    const res = await apiClient.get<ApiResponse<RoleRecord[]>>("/control-plane/roles");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createAPIKey: async (payload: { organizationId: string; keyName: string; scopes?: string[] }): Promise<APIKeyRecord> => {
    const res = await apiClient.post<ApiResponse<APIKeyRecord>>("/control-plane/api-keys", payload);
    return res.data?.data || res.data;
  },

  storeSecret: async (payload: { organizationId: string; keyName: string; secretValue: string }): Promise<SecretRecord> => {
    const res = await apiClient.post<ApiResponse<SecretRecord>>("/control-plane/secrets", payload);
    return res.data?.data || res.data;
  },

  getFeatureFlags: async (): Promise<FeatureFlagRecord[]> => {
    const res = await apiClient.get<ApiResponse<FeatureFlagRecord[]>>("/control-plane/feature-flags");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  updateFeatureFlag: async (id: string, enabled: boolean): Promise<FeatureFlagRecord> => {
    const res = await apiClient.patch<ApiResponse<FeatureFlagRecord>>(`/control-plane/feature-flags/${id}`, { enabled });
    return res.data?.data || res.data;
  },

  getQuotas: async (): Promise<QuotaPolicyRecord[]> => {
    const res = await apiClient.get<ApiResponse<QuotaPolicyRecord[]>>("/control-plane/quotas");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getInvitations: async (organizationId: string): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>(`/control-plane/organizations/${organizationId}/invitations`);
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createInvitation: async (organizationId: string, payload: { email: string; role?: string }): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>(`/control-plane/organizations/${organizationId}/invitations`, payload);
    return res.data?.data || res.data;
  },
};
