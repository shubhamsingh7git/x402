import { ExecutionContext, ProviderExecutionAttempt, ExecutionStrategyType } from "./ExecutionTypes";

export interface IExecutionStrategy {
  strategyType: ExecutionStrategyType;
  executeCandidates(
    candidates: any[],
    context: ExecutionContext
  ): Promise<{
    attempts: ProviderExecutionAttempt[];
    winningAttempt?: ProviderExecutionAttempt;
    fallbackTriggered: boolean;
    fallbackCount: number;
  }>;
}
