import { IExecutionStrategy } from "./ExecutionStrategy";
import { ExecutionContext, ProviderExecutionAttempt, ExecutionStrategyType } from "./ExecutionTypes";
import { ParallelExecutionStrategy } from "./ParallelExecutionStrategy";

export class ConsensusExecutionStrategy implements IExecutionStrategy {
  strategyType: ExecutionStrategyType = "CONSENSUS";

  async executeCandidates(
    candidates: any[],
    context: ExecutionContext
  ): Promise<{
    attempts: ProviderExecutionAttempt[];
    winningAttempt?: ProviderExecutionAttempt;
    fallbackTriggered: boolean;
    fallbackCount: number;
  }> {
    const parallel = new ParallelExecutionStrategy();
    return parallel.executeCandidates(candidates, context);
  }
}
