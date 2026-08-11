import { projectRepository } from "../repositories/ProjectRepository";
import { ProjectStatusEnum } from "./ProjectStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class ProjectService {
  async createProject(data: { organizationId: string; workspaceId: string; name: string }) {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const proj = await projectRepository.create({
      ...data,
      projectId,
      status: ProjectStatusEnum.ACTIVE,
    });

    logger.info(`📦 ProjectService created Project [${projectId}] (${data.name})`);
    eventBus.emitEvent("controlplane:projectCreated" as any, proj as any);
    return proj;
  }

  async getProjects(workspaceId?: string) {
    if (workspaceId) return projectRepository.findByWorkspaceId(workspaceId);
    return projectRepository.find(50);
  }
}

export const projectService = new ProjectService();
