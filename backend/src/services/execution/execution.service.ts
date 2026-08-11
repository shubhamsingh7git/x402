import { executorRegistry } from "../../core/executors/ExecutorRegistry";
import { memoryService } from "../memory/memory.service";
import { timelineService } from "../timeline/timeline.service";
import { agentRunRepository } from "../../repositories/agentRun.repository";
import { eventBus } from "../../events/eventBus";
import { EVENTS, TIMELINE_EVENTS } from "../../constants/events";
import { AGENT_STATUS } from "../../constants/status";
import { GeneratedPlanStep } from "../../providers/gemini/GeminiProvider";
import { logger } from "../../utils/logger";
import { IAgentStep } from "../../interfaces/agent.interface";

export class ExecutionService {
  async executePlan(runId: string, steps: GeneratedPlanStep[]): Promise<unknown> {
    logger.info(`🚀 Starting execution of ${steps.length} steps for runId: ${runId}...`);

    // Initialize memory store for this run
    memoryService.initializeMemory(runId);

    const agentSteps: IAgentStep[] = steps.map((s) => ({
      id: s.id,
      title: s.title || `Step ${s.id}: ${s.type}`,
      type: s.type,
      status: AGENT_STATUS.QUEUED,
      input: s.input,
      retryCount: 0,
    }));

    // Update AgentRun with formatted steps
    await agentRunRepository.updateById(runId, {
      status: AGENT_STATUS.EXECUTING,
      steps: agentSteps as any,
    });

    let finalSummaryOutput: unknown = null;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepStartTime = Date.now();

      logger.info(`▶️ Executing Step ${step.id} [${step.type}] for runId: ${runId}`);

      // 1. Record Step Started
      await timelineService.recordEvent(runId, TIMELINE_EVENTS.STEP_STARTED, step.id, {
        stepType: step.type,
        title: step.title,
      });

      eventBus.emitEvent(EVENTS.STEP_STARTED, {
        runId,
        stepId: step.id,
        type: step.type,
        title: step.title,
      });

      // Update step status to EXECUTING in AgentRun
      agentSteps[i].status = AGENT_STATUS.EXECUTING;
      agentSteps[i].startedAt = new Date();
      await agentRunRepository.updateById(runId, { steps: agentSteps as any });

      // 2. Get Executor from Registry
      const executor = executorRegistry.getExecutor(step.type);
      const memory = memoryService.getMemory(runId);

      let maxRetries = 1;
      let attempt = 0;
      let stepSuccess = false;
      let result = null;

      while (attempt <= maxRetries && !stepSuccess) {
        attempt++;
        try {
          result = await executor.execute(
            {
              runId,
              stepId: step.id,
              type: step.type,
              input: step.input || {},
            },
            memory as unknown as Record<string, unknown>
          );

          if (result.success) {
            stepSuccess = true;
          } else {
            throw new Error(result.error || "Executor returned success=false");
          }
        } catch (error: any) {
          logger.warn(`Step ${step.id} attempt ${attempt} failed: ${error.message}`);
          agentSteps[i].retryCount = attempt;
          if (attempt > maxRetries) {
            // 3. Handle Step Failure
            const duration = Date.now() - stepStartTime;
            agentSteps[i].status = AGENT_STATUS.FAILED;
            agentSteps[i].error = error.message;
            agentSteps[i].duration = duration;
            agentSteps[i].completedAt = new Date();

            await agentRunRepository.updateById(runId, {
              status: AGENT_STATUS.FAILED,
              steps: agentSteps as any,
            });

            await timelineService.recordEvent(runId, TIMELINE_EVENTS.STEP_FAILED, step.id, {
              error: error.message,
              duration,
            });

            eventBus.emitEvent(EVENTS.STEP_FAILED, {
              runId,
              stepId: step.id,
              error: error.message,
            });

            eventBus.emitEvent(EVENTS.RESEARCH_ERROR, {
              runId,
              error: `Step ${step.id} [${step.type}] failed: ${error.message}`,
            });

            throw new Error(`Execution halted at step ${step.id}: ${error.message}`);
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // 4. Handle Step Completion
      const duration = Date.now() - stepStartTime;
      const output = result?.output;

      // Save to Memory
      memoryService.saveStepOutput(runId, step.type, output, result?.artifacts);

      if (step.type.toUpperCase() === "SUMMARY") {
        finalSummaryOutput = output;
      }

      agentSteps[i].status = AGENT_STATUS.COMPLETED;
      agentSteps[i].output = output;
      agentSteps[i].duration = duration;
      agentSteps[i].completedAt = new Date();
      agentSteps[i].cost = result?.cost || 0;

      await agentRunRepository.updateById(runId, { steps: agentSteps as any });

      await timelineService.recordEvent(runId, TIMELINE_EVENTS.STEP_COMPLETED, step.id, {
        duration,
        artifactsCount: result?.artifacts?.length || 0,
      });

      eventBus.emitEvent(EVENTS.STEP_COMPLETED, {
        runId,
        stepId: step.id,
        output,
        duration,
      });

      // Brief delay between steps for visual simulation
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    return finalSummaryOutput;
  }
}

export const executionService = new ExecutionService();
