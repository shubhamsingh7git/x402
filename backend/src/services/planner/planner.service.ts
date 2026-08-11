import { geminiProvider, GeneratedPlan, GeneratedPlanStep } from "../../providers/gemini/GeminiProvider";
import { buildPlannerPrompt } from "../../prompts/planner.prompt";
import { timelineService } from "../timeline/timeline.service";
import { eventBus } from "../../events/eventBus";
import { EVENTS, TIMELINE_EVENTS } from "../../constants/events";
import { logger } from "../../utils/logger";
import { plannerService as bazaarPlannerService } from "../../planner/PlannerService";

export class PlannerService {
  async generatePlan(runId: string, userQuery: string): Promise<GeneratedPlanStep[]> {
    logger.info(`🗺️ Planning dynamic Bazaar execution steps for runId: ${runId}...`);
    await timelineService.recordEvent(runId, TIMELINE_EVENTS.PLAN_STARTED, undefined, { query: userQuery });
    eventBus.emitEvent(EVENTS.PLAN_STARTED, { runId, query: userQuery });

    let dynamicExecutionPlan = null;
    try {
      // Dynamic Bazaar Planner Discovery (Milestone 5.2)
      dynamicExecutionPlan = await bazaarPlannerService.analyzeAndPlan(userQuery, { runId });
    } catch (err) {
      logger.warn({ err }, "Dynamic Bazaar discovery fallback triggered");
    }

    let steps: GeneratedPlanStep[] = [];

    if (dynamicExecutionPlan && dynamicExecutionPlan.steps.length > 0) {
      // Map dynamic Bazaar provider steps to execution steps
      steps = dynamicExecutionPlan.steps.map((step) => ({
        id: step.stepId,
        type: step.capability === "web-search" ? "SEARCH" : step.capability === "financial-analysis" ? "API_CALL" : "SUMMARY",
        title: step.title,
        input: {
          query: userQuery,
          capability: step.capability,
          providerId: step.provider.providerId,
          merchantId: step.provider.merchantId,
          merchantAlias: step.provider.merchantAlias,
          explanation: step.explanation.selectionReason,
          plannerScore: step.explanation.plannerScore,
          pricePerCall: step.provider.pricePerCall,
        },
      }));
    } else {
      // Fallback to Gemini LLM Planner if no providers discovered
      const prompt = buildPlannerPrompt(userQuery);
      const planResult = await geminiProvider.generateJSON<GeneratedPlan>(prompt);
      steps = planResult.steps || [];
    }

    await timelineService.recordEvent(runId, TIMELINE_EVENTS.PLAN_COMPLETED, undefined, {
      stepsCount: steps.length,
      model: "bazaar-dynamic-planner-v5.2",
    });

    eventBus.emitEvent(EVENTS.PLAN_GENERATED, {
      runId,
      steps,
      model: "bazaar-dynamic-planner-v5.2",
    });

    return steps;
  }
}

export const plannerService = new PlannerService();

