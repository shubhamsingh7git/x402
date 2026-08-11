import { releaseRepository } from "../repositories/ReleaseRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class ReleaseGovernance {
  async approveRelease(version: string, title: string) {
    const releaseId = `rel_${Date.now()}`;
    const release = await releaseRepository.saveRelease({
      releaseId,
      version,
      title,
      status: "APPROVED",
      approvedBy: "release-governance-board@enterprise.iam",
      scheduledAt: new Date(),
    });

    logger.info(`📋 ReleaseGovernance approved Production Change Request: [${version}] ${title}`);
    eventBus.emitEvent("production:releaseApproved" as any, release as any);
    return release;
  }

  async getReleases() {
    return releaseRepository.findReleases();
  }

  async getRunbooks() {
    return releaseRepository.findRunbooks();
  }
}

export const releaseGovernance = new ReleaseGovernance();
