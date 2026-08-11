import { RequestStateEnum } from "./GatewayStatus";

export interface IRequestContext {
  requestId: string;
  correlationId: string;
  tenantId?: string;
  organizationId?: string;
  workspaceId?: string;
  projectId?: string;
  authenticatedUserId?: string;
  permissions: string[];
  featureFlags: Record<string, boolean>;
  state: RequestStateEnum;
  receivedAt: Date;
}

export function createRequestContext(overrides: Partial<IRequestContext> = {}): IRequestContext {
  const now = new Date();
  return {
    requestId: overrides.requestId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    correlationId: overrides.correlationId || `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tenantId: overrides.tenantId || "org_default_01",
    organizationId: overrides.organizationId || "org_default_01",
    workspaceId: overrides.workspaceId || "ws_default_01",
    projectId: overrides.projectId || "proj_default_01",
    authenticatedUserId: overrides.authenticatedUserId || "usr_admin_01",
    permissions: overrides.permissions || ["*"],
    featureFlags: overrides.featureFlags || { "enable-v2-api": true },
    state: RequestStateEnum.RECEIVED,
    receivedAt: now,
  };
}
