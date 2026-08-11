import { organizationRepository } from "../repositories/OrganizationRepository";
import { OrganizationStatusEnum } from "./OrganizationStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class OrganizationService {
  async createOrganization(data: { name: string; slug: string; ownerId?: string }) {
    const organizationId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const org = await organizationRepository.create({
      ...data,
      organizationId,
      ownerId: data.ownerId || "usr_admin",
      status: OrganizationStatusEnum.ACTIVE,
    });

    logger.info(`🏢 OrganizationService created Organization [${organizationId}] (${data.name})`);
    eventBus.emitEvent("controlplane:organizationCreated" as any, org as any);
    return org;
  }

  async getOrganizations() {
    return organizationRepository.find(50);
  }
}

export const organizationService = new OrganizationService();
