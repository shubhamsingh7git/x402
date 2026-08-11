import { ExecutionContext, ProviderExecutionAttempt } from "./ExecutionTypes";
import { circuitBreaker } from "./CircuitBreaker";
import { providerExecutor } from "./ProviderExecutor";
import { EXECUTION_CONFIG } from "./ExecutionConfig";
import { logger } from "../utils/logger";

export class FallbackManager {
  async executeWithFallback(
    candidates: any[],
    context: ExecutionContext
  ): Promise<{
    attempts: ProviderExecutionAttempt[];
    winningAttempt?: ProviderExecutionAttempt;
    fallbackTriggered: boolean;
    fallbackCount: number;
  }> {
    const attempts: ProviderExecutionAttempt[] = [];
    let fallbackCount = 0;

    // Filter out providers with OPEN circuit breaker state
    const eligibleCandidates = candidates.filter((c) => {
      const pid = c.provider?.providerId || c.providerId || "";
      return !circuitBreaker.isOpen(pid);
    });

    if (eligibleCandidates.length === 0) {
      logger.warn(`⚠️ FallbackManager: All candidates for capability '${context.capability}' have OPEN circuit breakers`);
      return { attempts: [], fallbackTriggered: true, fallbackCount: 0 };
    }

    for (let i = 0; i < Math.min(eligibleCandidates.length, EXECUTION_CONFIG.maxFallbackAttempts); i++) {
      const candidate = eligibleCandidates[i];

      if (i > 0) {
        fallbackCount++;
        logger.info(`🔄 FallbackManager triggering fallback #${fallbackCount} to candidate: ${candidate.provider?.providerId || candidate.providerId}`);
      }

      // Retry loop per provider
      for (let retry = 1; retry <= EXECUTION_CONFIG.maxRetriesPerProvider; retry++) {
        const attempt = await providerExecutor.executeProvider(candidate, {
          ...context,
          attemptNumber: retry,
        });

        attempts.push(attempt);

        if (attempt.status === "SUCCESS") {
          return {
            attempts,
            winningAttempt: attempt,
            fallbackTriggered: fallbackCount > 0,
            fallbackCount,
          };
        }
      }
    }

    return {
      attempts,
      fallbackTriggered: fallbackCount > 0,
      fallbackCount,
    };
  }
}

export const fallbackManager = new FallbackManager();
