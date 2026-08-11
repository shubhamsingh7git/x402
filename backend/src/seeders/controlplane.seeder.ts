import { organizationService } from "../control-plane/OrganizationService";
import { workspaceService } from "../control-plane/WorkspaceService";
import { projectService } from "../control-plane/ProjectService";
import { teamService } from "../control-plane/TeamService";
import { rbacService } from "../control-plane/RBACService";
import { featureFlagService } from "../control-plane/FeatureFlagService";
import { quotaService } from "../control-plane/QuotaService";
import { organizationRepository } from "../repositories/OrganizationRepository";
import { CONTROL_PLANE_CONFIG } from "../control-plane/ControlPlaneConfig";
import { logger } from "../utils/logger";

export async function seedControlPlaneData(): Promise<void> {
  try {
    const count = await organizationRepository.count();
    if (count > 0) return;

    logger.info("🌱 Seeding Enterprise Control Plane hierarchy & governance...");

    const org = await organizationService.createOrganization({
      name: "Enterprise Core Org",
      slug: "enterprise-core-org",
      ownerId: "usr_admin",
    });

    const ws = await workspaceService.createWorkspace({
      organizationId: CONTROL_PLANE_CONFIG.defaultOrganizationId,
      name: "Production Workspace",
      slug: "production-workspace",
    });

    await projectService.createProject({
      organizationId: CONTROL_PLANE_CONFIG.defaultOrganizationId,
      workspaceId: CONTROL_PLANE_CONFIG.defaultWorkspaceId,
      name: "Alpha AI Platform",
    });

    await teamService.createTeam({
      organizationId: CONTROL_PLANE_CONFIG.defaultOrganizationId,
      name: "Core AI Engineering Team",
      description: "Primary engineering team responsible for multi-agent platform orchestration",
    });

    await rbacService.createRole({
      roleName: "Organization Administrator",
      scope: "ORGANIZATION",
      permissions: ["org:admin", "workspace:admin", "planner:execute", "secret:manage"],
      isCustom: false,
    });

    await featureFlagService.createFeatureFlag({
      name: "Enable Multi-Agent Consensus Strategy",
      key: "ff_multi_agent_consensus",
      enabled: true,
      targetScope: "GLOBAL",
    });

    await quotaService.setQuotaPolicy(CONTROL_PLANE_CONFIG.defaultOrganizationId, 500, 10000);

    logger.info("✅ Enterprise Control Plane seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Control Plane seeder warning: ${err.message}`);
  }
}
