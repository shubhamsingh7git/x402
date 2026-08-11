import { ExecutionContext, ExecutionResult, ExecutionStrategyType } from "./ExecutionTypes";
import { ExecutionStateEnum } from "./ExecutionState";
import { ExecutionStrategyFactory } from "./ExecutionStrategyFactory";
import { fallbackManager } from "./FallbackManager";
import { consensusResolver } from "./ConsensusResolver";
import { executionMonitor } from "./ExecutionMonitor";
import { executionRepository } from "../repositories/ExecutionRepository";
import { eventBus } from "../events/eventBus";
import { auditLogRepository } from "../repositories/auditLog.repository";
import { timelineEventRepository } from "../repositories/timelineEvent.repository";

export class ExecutionOrchestrator {
  async orchestrateStepExecution(
    capability: string,
    candidates: any[],
    strategyType: ExecutionStrategyType = "BALANCED",
    meta?: any
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const sessionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    executionMonitor.recordStart();

    // 1. Initial State: CREATED
    let session = await executionRepository.create({
      sessionId,
      runId: meta?.runId,
      planId: meta?.planId,
      capability,
      strategy: strategyType,
      state: ExecutionStateEnum.CREATED,
      success: false,
      startedAt: new Date(),
    });

    eventBus.emitEvent("execution:started" as any, { sessionId, capability, strategy: strategyType });

    // 2. DISCOVERING & RANKING states
    await executionRepository.updateBySessionId(sessionId, { state: ExecutionStateEnum.RANKING });

    // 3. EXECUTING state
    await executionRepository.updateBySessionId(sessionId, { state: ExecutionStateEnum.EXECUTING });

    const context: ExecutionContext = {
      sessionId,
      runId: meta?.runId,
      planId: meta?.planId,
      capability,
      strategy: strategyType,
      attemptNumber: 1,
      maxRetries: 3,
      timeoutMs: 15000,
    };

    let execResult;
    if (strategyType === "PARALLEL" || strategyType === "CONSENSUS") {
      const strategy = ExecutionStrategyFactory.getStrategy(strategyType);
      execResult = await strategy.executeCandidates(candidates, context);
    } else {
      execResult = await fallbackManager.executeWithFallback(candidates, context);
    }

    const { attempts, winningAttempt, fallbackTriggered, fallbackCount } = execResult;

    // Record attempts with EventBus
    attempts.forEach((att) => {
      eventBus.emitEvent("execution:providerCompleted" as any, { sessionId, attempt: att });
    });

    // 4. CONSENSUS resolution if consensus strategy
    let consensus;
    if (strategyType === "CONSENSUS" && attempts.length > 0) {
      await executionRepository.updateBySessionId(sessionId, { state: ExecutionStateEnum.CONSENSUS });
      eventBus.emitEvent("execution:consensusStarted" as any, { sessionId, attemptsCount: attempts.length });
      consensus = consensusResolver.resolveConsensus(attempts);
      eventBus.emitEvent("execution:consensusCompleted" as any, { sessionId, consensus });
    }

    // 5. PAYMENT state
    await executionRepository.updateBySessionId(sessionId, { state: ExecutionStateEnum.PAYMENT });

    const totalDurationMs = Date.now() - startTime;
    const isSuccess = !!winningAttempt && winningAttempt.status === "SUCCESS";
    const totalCostUsd = winningAttempt ? winningAttempt.costUsd : 0;

    const finalState = isSuccess ? ExecutionStateEnum.COMPLETED : ExecutionStateEnum.FAILED;

    const result: ExecutionResult = {
      sessionId,
      capability,
      strategy: strategyType,
      state: finalState,
      success: isSuccess,
      finalProviderId: winningAttempt?.providerId,
      finalMerchantAlias: winningAttempt?.merchantAlias,
      output: winningAttempt?.output || consensus?.finalResult,
      attempts,
      fallbackTriggered,
      fallbackCount,
      consensus,
      totalCostUsd,
      totalDurationMs,
      error: isSuccess ? undefined : "All candidate provider attempts failed or timed out",
      startedAt: session.startedAt,
      completedAt: new Date(),
    };

    // Update persisted MongoDB session
    await executionRepository.updateBySessionId(sessionId, {
      state: finalState,
      success: isSuccess,
      finalProviderId: result.finalProviderId,
      finalMerchantAlias: result.finalMerchantAlias,
      output: result.output,
      attempts: result.attempts,
      fallbackTriggered: result.fallbackTriggered,
      fallbackCount: result.fallbackCount,
      consensus: result.consensus as any,
      totalCostUsd: result.totalCostUsd,
      totalDurationMs: result.totalDurationMs,
      error: result.error,
      completedAt: result.completedAt as Date,
    });

    // Update Monitor
    executionMonitor.recordEnd(isSuccess, totalDurationMs, attempts.length, fallbackCount);

    // Audit log
    await auditLogRepository.create({
      action: isSuccess ? ("EXECUTION_COMPLETED" as any) : ("EXECUTION_FAILED" as any),
      user: meta?.userId,
      ip: meta?.ip || "127.0.0.1",
      userAgent: meta?.userAgent || "ExecutionOrchestrator/1.0",
      metadata: {
        sessionId,
        capability,
        strategy: strategyType,
        providerId: result.finalProviderId,
        durationMs: totalDurationMs,
        attemptsCount: attempts.length,
        costUsd: totalCostUsd,
      },
    });

    // Timeline event if runId provided
    if (meta?.runId) {
      await timelineEventRepository.create({
        runId: meta.runId,
        event: isSuccess ? "EXECUTION_COMPLETED" : "EXECUTION_FAILED",
        metadata: { sessionId, capability, providerId: result.finalProviderId, durationMs: totalDurationMs },
      });
    }

    eventBus.emitEvent("execution:completed" as any, result as any);
    return result;
  }
}

export const executionOrchestrator = new ExecutionOrchestrator();
