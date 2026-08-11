import { metricsRepository } from "../repositories/MetricsRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class MetricsEngine {
  async recordMetric(metricName: string, value: number, serviceName = "api-gateway", tags: Record<string, string> = {}) {
    const metric = await metricsRepository.save({
      metricName,
      metricType: "GAUGE",
      value,
      serviceName,
      tags: tags as any,
    });

    eventBus.emitEvent("observability:metricUpdated" as any, metric as any);
    return metric;
  }

  async getMetrics() {
    return metricsRepository.find(50);
  }
}

export const metricsEngine = new MetricsEngine();
