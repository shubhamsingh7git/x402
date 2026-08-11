import { IExecutor, ExecutorInput, ExecutorResult } from "../../interfaces/executor.interface";

export abstract class BaseExecutor implements IExecutor {
  abstract readonly type: string;

  supports(type: string): boolean {
    return this.type.toUpperCase() === type.toUpperCase();
  }

  abstract execute(input: ExecutorInput, memory: Record<string, unknown>): Promise<ExecutorResult>;

  protected createResult<T>(
    success: boolean,
    output: T,
    cost = 0,
    metadata: Record<string, unknown> = {},
    artifacts: unknown[] = [],
    error?: string
  ): ExecutorResult<T> {
    return {
      success,
      output,
      cost,
      metadata: { ...metadata, executedAt: new Date().toISOString() },
      artifacts,
      error,
    };
  }
}
