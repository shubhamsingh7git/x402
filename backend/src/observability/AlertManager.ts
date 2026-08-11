import { alertRepository } from "../repositories/AlertRepository";
import { AlertSeverityEnum } from "./AlertSeverity";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class AlertManager {
  async createAlertRule(ruleName: string, targetMetric: string, threshold: number, severity = AlertSeverityEnum.MEDIUM) {
    const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const rule = await alertRepository.saveRule({
      ruleId,
      ruleName,
      targetMetric,
      threshold,
      severity,
      enabled: true,
    });
    return rule;
  }

  async triggerAlert(title: string, message: string, serviceName = "api-gateway", severity = AlertSeverityEnum.HIGH, ruleId?: string) {
    const alertId = `alr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const alert = await alertRepository.saveAlert({
      alertId,
      ruleId,
      title,
      message,
      serviceName,
      severity,
      status: "ACTIVE",
    });

    logger.warn(`🚨 AlertManager triggered Alert [${alertId}] '${title}' (${severity}) on '${serviceName}'`);
    eventBus.emitEvent("observability:alertCreated" as any, alert as any);
    return alert;
  }

  async getAlerts() {
    return alertRepository.findAlerts(50);
  }

  async getRules() {
    return alertRepository.findRules();
  }
}

export const alertManager = new AlertManager();
