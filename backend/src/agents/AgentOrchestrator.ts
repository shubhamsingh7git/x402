import { agentRouter } from "./AgentRouter";
import { memoryManager } from "./MemoryManager";
import { governanceEngine } from "./GovernanceEngine";
import { approvalService } from "./ApprovalService";
import { executionEngine } from "../execution/ExecutionEngine";
import { bazaarService } from "../bazaar/BazaarService";
import { agentExecutionRepository } from "../repositories/AgentExecutionRepository";
import { auditLogRepository } from "../repositories/auditLog.repository";
import { timelineEventRepository } from "../repositories/timelineEvent.repository";
import { eventBus } from "../events/eventBus";
import { IAgentSubtask } from "./AgentTypes";
import { logger } from "../utils/logger";

export class AgentOrchestrator {
  async orchestrateMultiAgentSession(prompt: string, meta?: any) {
    const startTime = Date.now();
    const sessionId = `agsession_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    eventBus.emitEvent("agent:started" as any, { sessionId, prompt });

    // 1. Dynamic Task Decomposition into subtask graph
    const taskGraph: IAgentSubtask[] = [
      {
        subtaskId: "st_1",
        capability: "financial-analysis",
        input: { prompt, focus: "market valuation" },
        status: "PENDING",
        dependencies: [],
      },
      {
        subtaskId: "st_2",
        capability: "web-search",
        input: { prompt, focus: "latest competitor news" },
        status: "PENDING",
        dependencies: ["st_1"],
      },
    ];

    const session = await agentExecutionRepository.create({
      sessionId,
      prompt,
      taskGraph,
      status: "ORCHESTRATING",
      totalCostUsd: 0,
      totalDurationMs: 0,
    });

    let totalCostUsd = 0;
    const completedGraph: IAgentSubtask[] = [];

    // 2. Iterate through subtasks with agent routing, memory sync, and execution
    for (const subtask of taskGraph) {
      // Governance Check
      const gov = governanceEngine.evaluateTaskGovernance(subtask.capability);
      if (gov.requiresApproval) {
        subtask.status = "WAITING_APPROVAL";
        await approvalService.createApprovalRequest(
          sessionId,
          subtask.capability,
          gov.riskScore,
          `High risk task '${subtask.capability}' requires human gate approval`,
          "ag_planner_01"
        );
        await agentExecutionRepository.updateBySessionId(sessionId, { status: "WAITING_APPROVAL" });
        return { sessionId, prompt, status: "WAITING_APPROVAL", taskGraph, totalCostUsd, totalDurationMs: Date.now() - startTime };
      }

      // Router Assignment
      const agent = await agentRouter.routeTask(subtask.capability);
      subtask.assignedAgentId = agent?.agentId || "ag_general_01";
      subtask.assignedAgentName = agent?.agentName || "General Reasoning Agent";
      subtask.status = "RUNNING";

      // Execute via ExecutionEngine / Bazaar
      const searchRes = await bazaarService.searchAndRank({ capability: subtask.capability });
      const candidates = searchRes.candidates || [];
      const execRes = await executionEngine.executeStep(subtask.capability, candidates, "BALANCED", meta);

      subtask.status = execRes.success ? "COMPLETED" : "FAILED";
      subtask.output = execRes.output;
      subtask.durationMs = execRes.totalDurationMs;
      subtask.confidence = agent?.confidenceScore || 0.90;
      totalCostUsd += execRes.totalCostUsd;

      // Write intermediate output into Shared Memory
      await memoryManager.writeMemory(sessionId, subtask.assignedAgentId, subtask.subtaskId, execRes.output, [subtask.capability]);

      completedGraph.push(subtask);
    }

    const totalDurationMs = Date.now() - startTime;
    const finalStatus = completedGraph.every((s) => s.status === "COMPLETED") ? "COMPLETED" : "FAILED";

    const finalSession = await agentExecutionRepository.updateBySessionId(sessionId, {
      taskGraph: completedGraph,
      status: finalStatus,
      totalCostUsd,
      totalDurationMs,
      completedAt: new Date(),
    });

    await auditLogRepository.create({
      action: "MULTI_AGENT_ORCHESTRATION_COMPLETED" as any,
      user: meta?.userId,
      ip: meta?.ip || "127.0.0.1",
      userAgent: meta?.userAgent || "AgentOrchestrator/1.0",
      metadata: { sessionId, prompt, subtaskCount: completedGraph.length, totalCostUsd },
    });

    eventBus.emitEvent("agent:completed" as any, finalSession as any);
    return finalSession;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
