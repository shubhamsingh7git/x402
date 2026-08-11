import { IExecutor } from "../../interfaces/executor.interface";
import { searchExecutor } from "./SearchExecutor";
import { financialExecutor } from "./FinancialExecutor";
import { summaryExecutor } from "./SummaryExecutor";
import { ApiError } from "../../utils/ApiError";
import { logger } from "../../utils/logger";

export class ExecutorRegistry {
  private static instance: ExecutorRegistry;
  private executors = new Map<string, IExecutor>();

  private constructor() {
    this.register(searchExecutor);
    this.register(financialExecutor);
    this.register(summaryExecutor);
  }

  public static getInstance(): ExecutorRegistry {
    if (!ExecutorRegistry.instance) {
      ExecutorRegistry.instance = new ExecutorRegistry();
    }
    return ExecutorRegistry.instance;
  }

  public register(executor: IExecutor): void {
    this.executors.set(executor.type.toUpperCase(), executor);
    logger.info(`🔌 Registered step executor: ${executor.type}`);
  }

  public getExecutor(type: string): IExecutor {
    const uppercaseType = type.toUpperCase();

    // Direct match
    if (this.executors.has(uppercaseType)) {
      return this.executors.get(uppercaseType)!;
    }

    // Support check
    for (const executor of this.executors.values()) {
      if (executor.supports(type)) {
        return executor;
      }
    }

    // Default fallback to searchExecutor instead of throwing hard error
    logger.warn(`⚠️ Unknown step type "${type}". Falling back to SearchExecutor.`);
    return searchExecutor;
  }
}

export const executorRegistry = ExecutorRegistry.getInstance();
