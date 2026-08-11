import { incidentRepository } from "../repositories/IncidentRepository";
import { AlertSeverityEnum } from "./AlertSeverity";
import { IncidentStatusEnum } from "./IncidentStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class IncidentManager {
  async openIncident(title: string, affectedServices: string[], severity = AlertSeverityEnum.HIGH, rootCause?: string) {
    const incidentId = `inc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const incident = await incidentRepository.save({
      incidentId,
      title,
      affectedServices,
      severity,
      status: IncidentStatusEnum.OPEN,
      rootCause: rootCause || "Under Investigation",
      openedAt: new Date(),
    });

    logger.error(`🔥 IncidentManager opened Incident [${incidentId}] '${title}' on services: [${affectedServices.join(", ")}]`);
    eventBus.emitEvent("observability:incidentOpened" as any, incident as any);
    return incident;
  }

  async resolveIncident(incidentId: string, rootCause: string) {
    const updated = await incidentRepository.updateStatus(incidentId, IncidentStatusEnum.RESOLVED, rootCause);
    if (updated) {
      logger.info(`✅ IncidentManager resolved Incident [${incidentId}] Root cause: ${rootCause}`);
      eventBus.emitEvent("observability:incidentClosed" as any, updated as any);
    }
    return updated;
  }

  async getIncidents() {
    return incidentRepository.find(50);
  }
}

export const incidentManager = new IncidentManager();
