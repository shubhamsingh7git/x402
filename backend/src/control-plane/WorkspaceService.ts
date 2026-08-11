import { workspaceRepository } from "../repositories/WorkspaceRepository";
import { WorkspaceStatusEnum } from "./WorkspaceStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class WorkspaceService {
  async createWorkspace(data: { organizationId: string; name: string; slug: string }) {
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ws = await workspaceRepository.create({
      ...data,
      workspaceId,
      status: WorkspaceStatusEnum.ACTIVE,
    });

    logger.info(`📁 WorkspaceService created Workspace [${workspaceId}] (${data.name})`);
    eventBus.emitEvent("controlplane:workspaceCreated" as any, ws as any);
    return ws;
  }

  async getWorkspaces(organizationId?: string) {
    if (organizationId) return workspaceRepository.findByOrganizationId(organizationId);
    return workspaceRepository.find(50);
  }
}

export const workspaceService = new WorkspaceService();
