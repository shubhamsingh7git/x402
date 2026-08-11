import { executionEngine } from "./ExecutionEngine";
import { executionRepository } from "../repositories/ExecutionRepository";
import { executionMonitor } from "./ExecutionMonitor";
import { bazaarService } from "../bazaar/BazaarService";
import { ExecutionResult, ExecutionStrategyType } from "./ExecutionTypes";

export class ExecutionService {
  async runExecution(
    capability: string,
    strategy: ExecutionStrategyType = "BALANCED",
    meta?: any
  ): Promise<ExecutionResult> {
    const searchRes = await bazaarService.searchAndRank({ capability });
    const candidates = searchRes.candidates || [];
    return executionEngine.executeStep(capability, candidates, strategy, meta);
  }

  async getSessionById(sessionId: string) {
    return executionRepository.findBySessionId(sessionId);
  }

  async getExecutionHistory(limit = 50) {
    return executionRepository.find({}, limit);
  }

  async getTelemetryMetrics() {
    return executionMonitor.getTelemetry();
  }
}

export const executionService = new ExecutionService();
