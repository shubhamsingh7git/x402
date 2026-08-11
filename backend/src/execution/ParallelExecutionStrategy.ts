import { IExecutionStrategy } from "./ExecutionStrategy";
import { ExecutionContext, ProviderExecutionAttempt, ExecutionStrategyType } from "./ExecutionTypes";
import { providerExecutor } from "./ProviderExecutor";
import { EXECUTION_CONFIG } from "./ExecutionConfig";

export class ParallelExecutionStrategy implements IExecutionStrategy {
  strategyType: ExecutionStrategyType = "PARALLEL";

  async executeCandidates(
    candidates: any[],
    context: ExecutionContext
  ): Promise<{
    attempts: ProviderExecutionAttempt[];
    winningAttempt?: ProviderExecutionAttempt;
    fallbackTriggered: boolean;
    fallbackCount: number;
  }> {
    const activeGroup = candidates.slice(0, EXECUTION_CONFIG.maxParallelConcurrency);

    const attempts = await Promise.all(
      activeGroup.map((cand, idx) =>
        providerExecutor.executeProvider(cand, {
          ...context,
          parallelGroupId: `pgrp_${Date.now()}`,
          executionIndex: idx,
        })
      )
    );

    const successfulAttempts = attempts.filter((a) => a.status === "SUCCESS");
    successfulAttempts.sort((a, b) => a.durationMs - b.durationMs);

    const winner = successfulAttempts[0];

    return {
      attempts,
      winningAttempt: winner,
      fallbackTriggered: attempts.some((a) => a.status !== "SUCCESS"),
      fallbackCount: attempts.filter((a) => a.status !== "SUCCESS").length,
    };
  }
}
