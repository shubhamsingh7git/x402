export interface ExecutorResult<T = unknown> {
  success: boolean;
  output: T;
  cost: number;
  metadata: Record<string, unknown>;
  artifacts: unknown[];
  error?: string;
}

export interface ExecutorInput {
  runId: string;
  stepId: number;
  type: string;
  input: Record<string, unknown>;
}

export interface IExecutor {
  readonly type: string;
  supports(type: string): boolean;
  execute(input: ExecutorInput, memory: Record<string, unknown>): Promise<ExecutorResult>;
}
