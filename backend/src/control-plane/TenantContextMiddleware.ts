import { Request, Response, NextFunction } from "express";
import { CONTROL_PLANE_CONFIG } from "./ControlPlaneConfig";
import { logger } from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      tenantContext?: {
        organizationId: string;
        workspaceId: string;
        projectId?: string;
      };
    }
  }
}

export function tenantContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const orgHeader = req.header("X-Organization-Id");
  const wsHeader = req.header("X-Workspace-Id");
  const projHeader = req.header("X-Project-Id");

  req.tenantContext = {
    organizationId: orgHeader || CONTROL_PLANE_CONFIG.defaultOrganizationId,
    workspaceId: wsHeader || CONTROL_PLANE_CONFIG.defaultWorkspaceId,
    projectId: projHeader || CONTROL_PLANE_CONFIG.defaultProjectId,
  };

  logger.debug(`🔒 TenantContext resolved: Org=${req.tenantContext.organizationId}, WS=${req.tenantContext.workspaceId}`);
  next();
}
