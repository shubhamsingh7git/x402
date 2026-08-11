import { IExecutionStrategy } from "./ExecutionStrategy";
import { ExecutionContext, ProviderExecutionAttempt, ExecutionStrategyType } from "./ExecutionTypes";
import { SequentialExecutionStrategy } from "./SequentialExecutionStrategy";

export class BalancedExecutionStrategy implements IExecutionStrategy {
  strategyType: ExecutionStrategyType = "BALANCED";

  async executeCandidates(
    candidates: any[],
    context: ExecutionContext
  ): Promise<{
    attempts: ProviderExecutionAttempt[];
    winningAttempt?: ProviderExecutionAttempt;
    fallbackTriggered: boolean;
    fallbackCount: number;
  }> {
    const seq = new SequentialExecutionStrategy();
    return seq.executeCandidates(candidates, context);
  }
}
