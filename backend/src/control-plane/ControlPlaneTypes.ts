import { OrganizationStatusEnum } from "./OrganizationStatus";
import { WorkspaceStatusEnum } from "./WorkspaceStatus";
import { ProjectStatusEnum } from "./ProjectStatus";

export interface IOrganizationDTO {
  id?: string;
  organizationId: string;
  name: string;
  slug: string;
  status: OrganizationStatusEnum;
  ownerId: string;
  maxWorkspaces: number;
  createdAt?: string | Date;
}

export interface IWorkspaceDTO {
  id?: string;
  workspaceId: string;
  organizationId: string;
  name: string;
  slug: string;
  status: WorkspaceStatusEnum;
  maxProjects: number;
  createdAt?: string | Date;
}

export interface IProjectDTO {
  id?: string;
  projectId: string;
  workspaceId: string;
  organizationId: string;
  name: string;
  status: ProjectStatusEnum;
  createdAt?: string | Date;
}

export interface ITeamDTO {
  id?: string;
  teamId: string;
  organizationId: string;
  workspaceId?: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt?: string | Date;
}

export interface IRoleDTO {
  id?: string;
  roleId: string;
  roleName: string;
  scope: "ORGANIZATION" | "WORKSPACE" | "PROJECT" | "SYSTEM" | "CUSTOM";
  permissions: string[];
  isCustom: boolean;
  createdAt?: string | Date;
}

export interface IAPIKeyDTO {
  id?: string;
  keyId: string;
  organizationId: string;
  keyName: string;
  maskedKey: string;
  rawKey?: string;
  scopes: string[];
  expiresAt?: string | Date;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  createdAt?: string | Date;
}

export interface ISecretDTO {
  id?: string;
  secretId: string;
  organizationId: string;
  keyName: string;
  version: number;
  status: "ACTIVE" | "PREVIOUS" | "PENDING_ROTATION";
  createdAt?: string | Date;
}

export interface IFeatureFlagDTO {
  id?: string;
  flagId: string;
  name: string;
  key: string;
  enabled: boolean;
  targetScope: "GLOBAL" | "ORGANIZATION" | "WORKSPACE" | "PROJECT" | "ENVIRONMENT";
  targetId?: string;
  createdAt?: string | Date;
}

export interface IQuotaPolicyDTO {
  id?: string;
  quotaId: string;
  organizationId: string;
  maxDailySpendUsd: number;
  maxDailyRequests: number;
  currentDailySpendUsd: number;
  currentDailyRequests: number;
  updatedAt?: string | Date;
}

export interface IControlPlaneAnalyticsDTO {
  organizations: number;
  workspaces: number;
  projects: number;
  teams: number;
  members: number;
  apiKeys: number;
  activeApiKeys: number;
  secrets: number;
  featureFlags: number;
  quotaUsage: number; // Percentage 0-100
  activeInvitations: number;
}
