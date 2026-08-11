import { agentRunRepository } from "../../repositories/agentRun.repository";
import { timelineService } from "../timeline/timeline.service";
import { plannerService } from "../planner/planner.service";
import { executionService } from "../execution/execution.service";
import { memoryService } from "../memory/memory.service";
import { analyticsService } from "../analytics/analytics.service";
import { eventBus } from "../../events/eventBus";
import { EVENTS, TIMELINE_EVENTS } from "../../constants/events";
import { AGENT_STATUS } from "../../constants/status";
import { ApiError } from "../../utils/ApiError";
import { logger } from "../../utils/logger";
import { IAgentRun } from "../../interfaces/agent.interface";
import { AgentRun } from "../../models/AgentRun";

export class ResearchService {
  async initiateResearch(query: string, userId?: string): Promise<{ runId: string; status: string }> {
    const run = await agentRunRepository.create({
      query,
      status: AGENT_STATUS.QUEUED,
      userId: userId as any,
      startedAt: new Date(),
      plannerModel: "gemini-2.5-flash",
      executionVersion: "1.0",
      totalCost: 0,
      estimatedCost: 0,
      actualCost: 0,
    });

    const runId = run._id.toString();

    // Record RUN_CREATED timeline event
    await timelineService.recordEvent(runId, TIMELINE_EVENTS.RUN_CREATED, undefined, { query });

    // Emit live research:started event
    eventBus.emitEvent(EVENTS.RESEARCH_STARTED, { runId, query, startedAt: run.startedAt });

    // Trigger async pipeline execution in background
    setImmediate(() => {
      this.runPipeline(runId, query).catch((err) => {
        logger.error({ err }, `Background pipeline failed for runId: ${runId}`);
      });
    });

    return { runId, status: "started" };
  }

  async generatePlan(query: string, userId?: string): Promise<{ runId: string; plan: any[] }> {
    const run = await agentRunRepository.create({
      query,
      status: AGENT_STATUS.PLANNING,
      userId: userId as any,
      startedAt: new Date(),
      plannerModel: "gemini-2.5-flash",
      executionVersion: "1.0",
      totalCost: 0,
    });
    const runId = run._id.toString();
    const steps = await plannerService.generatePlan(runId, query);
    return { runId, plan: steps };
  }

  async executePlan(runId: string, plan: any[]): Promise<{ runId: string; results: any; totalCost: number }> {
    const finalResult = await executionService.executePlan(runId, plan);
    return { runId, results: finalResult, totalCost: 0.01 };
  }

  async listRuns(): Promise<any[]> {
    return AgentRun.find().sort({ createdAt: -1 }).limit(50);
  }

  private async runPipeline(runId: string, query: string): Promise<void> {
    const startTime = Date.now();
    try {
      // 1. Generate Plan via Gemini
      const steps = await plannerService.generatePlan(runId, query);

      // 2. Execute Plan via ExecutionService & Executors
      const finalResult = await executionService.executePlan(runId, steps);

      const totalDuration = Date.now() - startTime;

      // 3. Mark Run Completed
      await agentRunRepository.updateById(runId, {
        status: AGENT_STATUS.COMPLETED,
        completedAt: new Date(),
        duration: Math.floor(totalDuration / 1000),
        totalDuration,
      });

      // 4. Record Timeline Event
      await timelineService.recordEvent(runId, TIMELINE_EVENTS.RUN_COMPLETED, undefined, {
        totalDuration,
      });

      // 5. Invalidate Dashboard Cache & Emit Socket Events
      analyticsService.invalidateCache();
      eventBus.emitEvent(EVENTS.RESEARCH_COMPLETED, {
        runId,
        query,
        result: finalResult,
        totalDuration,
      });
      eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "research_completed" });

      logger.info(`✨ Research pipeline completed successfully for runId: ${runId} in ${totalDuration}ms`);
    } catch (error: any) {
      const totalDuration = Date.now() - startTime;
      logger.error({ err: error }, `❌ Research pipeline failed for runId: ${runId}`);

      await agentRunRepository.updateById(runId, {
        status: AGENT_STATUS.FAILED,
        completedAt: new Date(),
        duration: Math.floor(totalDuration / 1000),
        totalDuration,
      });

      await timelineService.recordEvent(runId, TIMELINE_EVENTS.RUN_FAILED, undefined, {
        error: error.message,
        totalDuration,
      });

      analyticsService.invalidateCache();
      eventBus.emitEvent(EVENTS.RESEARCH_ERROR, {
        runId,
        error: error.message,
      });
    } finally {
      // Clean up memory store
      memoryService.clearMemory(runId);
    }
  }

  async getRunDetails(runId: string): Promise<IAgentRun> {
    const run = await agentRunRepository.findById(runId);
    if (!run) {
      throw ApiError.notFound("Research run not found");
    }
    return run as unknown as IAgentRun;
  }

  async getRunTimeline(runId: string) {
    const run = await agentRunRepository.findById(runId);
    if (!run) {
      throw ApiError.notFound("Research run not found");
    }
    return timelineService.getTimelineForRun(runId);
  }

  async getRunResult(runId: string) {
    const run = await agentRunRepository.findById(runId);
    if (!run) {
      throw ApiError.notFound("Research run not found");
    }

    const summaryStep = run.steps.find((s) => s.type.toUpperCase() === "SUMMARY");
    return {
      runId,
      query: run.query,
      status: run.status,
      result: summaryStep?.output || null,
      stepsCount: run.steps.length,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      totalDuration: run.totalDuration,
    };
  }
}

export const researchService = new ResearchService();
