import { logger } from "../../utils/logger";

export interface ExecutionMemory {
  runId: string;
  search?: Record<string, unknown>;
  financial?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  metadata: Record<string, unknown>;
  artifacts: unknown[];
  stepsOutput: Record<string, unknown>;
}

export class MemoryService {
  private static instance: MemoryService;
  private memoryStore = new Map<string, ExecutionMemory>();

  private constructor() {}

  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  public initializeMemory(runId: string): ExecutionMemory {
    const mem: ExecutionMemory = {
      runId,
      metadata: { createdAt: new Date().toISOString() },
      artifacts: [],
      stepsOutput: {},
    };
    this.memoryStore.set(runId, mem);
    logger.debug(`🧠 Memory initialized for runId: ${runId}`);
    return mem;
  }

  public getMemory(runId: string): ExecutionMemory {
    let mem = this.memoryStore.get(runId);
    if (!mem) {
      mem = this.initializeMemory(runId);
    }
    return mem;
  }

  public saveStepOutput(runId: string, stepType: string, output: unknown, artifacts: unknown[] = []): void {
    const mem = this.getMemory(runId);
    mem.stepsOutput[stepType.toLowerCase()] = output;

    if (stepType === "SEARCH") {
      mem.search = output as Record<string, unknown>;
    } else if (stepType === "FINANCIAL_DATA" || stepType === "DATA") {
      mem.financial = output as Record<string, unknown>;
    } else if (stepType === "SUMMARY") {
      mem.summary = output as Record<string, unknown>;
    }

    if (artifacts && artifacts.length > 0) {
      mem.artifacts.push(...artifacts);
    }

    logger.debug(`🧠 Memory saved for runId: ${runId}, stepType: ${stepType}`);
  }

  public clearMemory(runId: string): void {
    this.memoryStore.delete(runId);
    logger.debug(`🧠 Memory cleared for runId: ${runId}`);
  }
}

export const memoryService = MemoryService.getInstance();
