import { openTelemetryTracer } from "../observability/OpenTelemetryTracer";
import { metricsEngine } from "../observability/MetricsEngine";
import { structuredLogger } from "../observability/StructuredLogger";
import { alertManager } from "../observability/AlertManager";
import { incidentManager } from "../observability/IncidentManager";
import { traceRepository } from "../repositories/TraceRepository";
import { AlertSeverityEnum } from "../observability/AlertSeverity";
import { logger } from "../utils/logger";

export async function seedObservabilityData(): Promise<void> {
  try {
    const count = await traceRepository.count();
    if (count > 0) return;

    logger.info("🌱 Seeding Enterprise Observability traces, metrics, logs, alert rules & incidents...");

    const { traceId } = await openTelemetryTracer.startTrace("POST /api/v1/planner/execute", "planner-service");
    await openTelemetryTracer.finishTrace(traceId, "OK");

    await metricsEngine.recordMetric("http_requests_per_minute", 340, "api-gateway");
    await metricsEngine.recordMetric("p95_latency_ms", 18, "api-gateway");

    await structuredLogger.log("INFO", "API Gateway request pipeline bootstrapped cleanly", "api-gateway");
    await structuredLogger.log("WARN", "Queue depth warning on default-execution queue (850 jobs)", "distributed-service");

    await alertManager.createAlertRule("High API Latency Alert", "http_latency_ms", 100, AlertSeverityEnum.HIGH);
    await alertManager.triggerAlert("Queue Depth Warning", "High pending jobs in default-execution queue", "distributed-service", AlertSeverityEnum.MEDIUM);

    await incidentManager.openIncident("Intermittent Latency Spike in Agent Network", ["agents-service", "intelligence-service"], AlertSeverityEnum.MEDIUM, "High background learning GPU load");

    logger.info("✅ Enterprise Observability seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Observability seeder warning: ${err.message}`);
  }
}
