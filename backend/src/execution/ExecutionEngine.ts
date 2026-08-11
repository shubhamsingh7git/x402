import { executionOrchestrator } from "./ExecutionOrchestrator";
import { ExecutionResult, ExecutionStrategyType } from "./ExecutionTypes";

export class ExecutionEngine {
  async executeStep(
    capability: string,
    candidates: any[],
    strategy: ExecutionStrategyType = "BALANCED",
    meta?: any
  ): Promise<ExecutionResult> {
    return executionOrchestrator.orchestrateStepExecution(capability, candidates, strategy, meta);
  }
}

export const executionEngine = new ExecutionEngine();
