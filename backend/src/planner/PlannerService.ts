import { capabilityPlanner } from "./CapabilityPlanner";
import { providerSelection } from "./ProviderSelection";
import { bazaarService } from "../bazaar/BazaarService";
import { IBazaarRankedCandidate } from "../bazaar/BazaarTypes";
import { PlannerExecutionPlan } from "./PlannerTypes";
import { eventBus } from "../events/eventBus";
import { auditLogRepository } from "../repositories/auditLog.repository";
import { timelineEventRepository } from "../repositories/timelineEvent.repository";

export class PlannerService {
  async analyzeAndPlan(prompt: string, meta?: any): Promise<PlannerExecutionPlan> {
    const startTime = Date.now();
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Emit analysis started event
    eventBus.emitEvent("planner:analysisStarted" as any, { planId, prompt });

    // 2. Extract capabilities from prompt
    const capabilityPlan = await capabilityPlanner.analyzePrompt(prompt);

    // 3. Query Bazaar for candidates per capability
    eventBus.emitEvent("bazaar:providersDiscovered" as any, { planId, prompt, capabilities: capabilityPlan.requiredCapabilities });
    const candidateMap = new Map<string, IBazaarRankedCandidate[]>();

    await Promise.all(
      capabilityPlan.requiredCapabilities.map(async (cap) => {
        try {
          const searchRes = await bazaarService.searchAndRank({ capability: cap.name });
          candidateMap.set(cap.name, searchRes.candidates || []);
        } catch (err) {
          candidateMap.set(cap.name, []);
        }
      })
    );

    // 4. Run Strategy Selection Engine
    const { resolvedSteps, unresolvedList } = providerSelection.selectForCapabilities(
      capabilityPlan.requiredCapabilities,
      candidateMap
    );

    const isFullyResolved = unresolvedList.length === 0;
    const planningDurationMs = Date.now() - startTime;

    const estimatedCostUsd = Number(
      resolvedSteps.reduce((acc, curr) => acc + (curr.provider.pricePerCall || 0.02), 0).toFixed(4)
    );

    const estimatedLatencyMs = resolvedSteps.reduce(
      (acc, curr) => Math.max(acc, curr.explanation.estimatedLatencyMs || 120),
      0
    );

    const averageConfidenceScore = resolvedSteps.length
      ? Number(
          (
            resolvedSteps.reduce((acc, curr) => acc + curr.explanation.plannerScore, 0) /
            resolvedSteps.length
          ).toFixed(1)
        )
      : 0;

    const result: PlannerExecutionPlan = {
      planId,
      prompt,
      status: isFullyResolved ? "RESOLVED" : "UNRESOLVED_CAPABILITIES",
      capabilities: capabilityPlan.requiredCapabilities,
      steps: resolvedSteps,
      unresolvedCapabilities: unresolvedList.length > 0 ? unresolvedList : undefined,
      summary: {
        totalSteps: capabilityPlan.requiredCapabilities.length,
        resolvedSteps: resolvedSteps.length,
        unresolvedSteps: unresolvedList.length,
        estimatedCostUsd,
        estimatedLatencyMs,
        averageConfidenceScore,
        planningDurationMs,
      },
      createdAt: new Date(),
    };

    // 5. Emit Events & Audit Logs
    eventBus.emitEvent("planner:providersSelected" as any, { planId, stepsCount: resolvedSteps.length } as any);
    eventBus.emitEvent("planner:executionPlanCreated" as any, result as any);

    // Audit Log
    await auditLogRepository.create({
      action: "PLANNER_ANALYSIS" as any,
      user: meta?.userId,
      ip: meta?.ip || "127.0.0.1",
      userAgent: meta?.userAgent || "PlannerEngine/1.0",
      metadata: {
        planId,
        prompt,
        capabilitiesCount: capabilityPlan.requiredCapabilities.length,
        resolvedStepsCount: resolvedSteps.length,
        estimatedCostUsd,
        planningDurationMs,
      },
    });

    // Timeline event if runId provided
    if (meta?.runId) {
      await timelineEventRepository.create({
        runId: meta.runId,
        event: "EXECUTION_PLAN_CREATED",
        metadata: { planId, status: result.status, stepsCount: resolvedSteps.length },
      });
    }

    return result;
  }
}

export const plannerService = new PlannerService();
