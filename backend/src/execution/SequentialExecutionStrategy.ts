import { IExecutionStrategy } from "./ExecutionStrategy";
import { ExecutionContext, ProviderExecutionAttempt, ExecutionStrategyType } from "./ExecutionTypes";
import { providerExecutor } from "./ProviderExecutor";

export class SequentialExecutionStrategy implements IExecutionStrategy {
  strategyType: ExecutionStrategyType = "SEQUENTIAL";

  async executeCandidates(
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

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (i > 0) fallbackCount++;

      const attempt = await providerExecutor.executeProvider(candidate, {
        ...context,
        attemptNumber: i + 1,
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

    return {
      attempts,
      fallbackTriggered: fallbackCount > 0,
      fallbackCount,
    };
  }
}
