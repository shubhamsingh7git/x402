import { logRepository } from "../repositories/LogRepository";
import { logger } from "../utils/logger";

export class StructuredLogger {
  async log(level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "AUDIT" | "SECURITY", message: string, serviceName = "api-gateway", traceId?: string, correlationId?: string) {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const logEntry = await logRepository.save({
      logId,
      level,
      message,
      serviceName,
      traceId,
      correlationId,
    });

    if (level === "ERROR") {
      logger.error(`[${serviceName}] ${message}`);
    } else {
      logger.info(`[${serviceName}] ${message}`);
    }

    return logEntry;
  }

  async getLogs(limit = 50) {
    return logRepository.find(limit);
  }
}

export const structuredLogger = new StructuredLogger();
