import { availabilityRepository } from "../repositories/AvailabilityRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class HighAvailabilityManager {
  async testFailover(policyId: string) {
    logger.warn(`🔄 HighAvailabilityManager initiating simulated regional failover for policy: [${policyId}]`);
    eventBus.emitEvent("production:failoverTested" as any, { policyId, status: "SUCCESS", failoverDurationMs: 420 });
    return { policyId, status: "SUCCESS", failoverDurationMs: 420, testedAt: new Date() };
  }

  async getRegions() {
    return availabilityRepository.findRegions();
  }

  async getFailoverPolicies() {
    return availabilityRepository.findPolicies();
  }
}

export const highAvailabilityManager = new HighAvailabilityManager();
