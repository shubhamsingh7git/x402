import { threatRepository } from "../repositories/ThreatRepository";
import { securityIncidentRepository } from "../repositories/SecurityIncidentRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class ThreatDetectionEngine {
  async recordThreat(threatType: string, ipAddress: string, description: string, severity = "HIGH") {
    const threatId = `thrt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const threat = await threatRepository.save({
      threatId,
      threatType,
      severity,
      ipAddress,
      description,
      status: "ACTIVE",
    });

    logger.warn(`⚠️ ThreatDetectionEngine recorded Threat [${threatId}] '${threatType}' from IP: ${ipAddress}`);
    eventBus.emitEvent("security:threatDetected" as any, threat as any);
    return threat;
  }

  async getThreats() {
    return threatRepository.find(50);
  }

  async getSecurityIncidents() {
    return securityIncidentRepository.find(50);
  }
}

export const threatDetectionEngine = new ThreatDetectionEngine();
