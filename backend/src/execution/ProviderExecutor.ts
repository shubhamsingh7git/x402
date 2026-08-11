import { ExecutionContext, ProviderExecutionAttempt } from "./ExecutionTypes";
import { providerHealthManager } from "./ProviderHealthManager";
import { circuitBreaker } from "./CircuitBreaker";
import { logger } from "../utils/logger";

export class ProviderExecutor {
  async executeProvider(
    candidate: any,
    context: ExecutionContext
  ): Promise<ProviderExecutionAttempt> {
    const startTime = Date.now();
    const providerId = candidate.provider?.providerId || candidate.providerId || "prov_unknown";
    const merchantAlias = candidate.provider?.merchantAlias || candidate.merchantAlias || "Unknown Merchant";
    const costUsd = candidate.provider?.pricePerCall || candidate.pricePerCall || 0.02;
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Circuit Breaker Guard
    if (circuitBreaker.isOpen(providerId)) {
      logger.warn(`🚫 ProviderExecutor skipping [${providerId}] — Circuit Breaker OPEN`);
      return {
        attemptId,
        providerId,
        merchantAlias,
        status: "CIRCUIT_OPEN",
        durationMs: 0,
        error: `Circuit breaker OPEN for provider ${providerId}`,
        costUsd: 0,
        timestamp: new Date(),
      };
    }

    try {
      logger.info(`⚡ Invoking Provider [${providerId}] (${merchantAlias}) for capability '${context.capability}'...`);

      // Simulated sub-second execution delay matching provider SLA
      const latencyMs = candidate.metadata?.latencyMs || Math.floor(Math.random() * 120) + 60;
      await new Promise((res) => setTimeout(res, Math.min(latencyMs, context.timeoutMs)));

      const durationMs = Date.now() - startTime;

      // Simulated success output contract
      const output = {
        capability: context.capability,
        providerId,
        merchantAlias,
        result: `Successfully processed capability '${context.capability}' via ${merchantAlias}`,
        telemetry: { durationMs, costUsd },
      };

      // Record health success
      providerHealthManager.recordAttempt(providerId, merchantAlias, true, durationMs);

      return {
        attemptId,
        providerId,
        merchantAlias,
        status: "SUCCESS",
        durationMs,
        output,
        costUsd,
        txHash: `0x${Math.random().toString(16).substring(2, 34)}`,
        timestamp: new Date(),
      };
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      providerHealthManager.recordAttempt(providerId, merchantAlias, false, durationMs);

      return {
        attemptId,
        providerId,
        merchantAlias,
        status: "FAILED",
        durationMs,
        error: err.message || "Provider invocation failed",
        costUsd: 0,
        timestamp: new Date(),
      };
    }
  }
}

export const providerExecutor = new ProviderExecutor();
