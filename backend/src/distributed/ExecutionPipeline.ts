import { jobRepository } from "../repositories/JobRepository";
import { lockManager } from "./LockManager";
import { JobStatusEnum } from "./JobStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class ExecutionPipeline {
  async executeJob(jobId: string, workerId = "wrk_default_01") {
    const job = await jobRepository.findByJobId(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found`);

    // 1. Lock Acquisition
    const lockAcquired = lockManager.acquireLock(jobId, workerId);
    if (!lockAcquired) {
      logger.warn(`Pipeline: Job [${jobId}] lock acquisition failed`);
      return job;
    }

    // 2. State transition to RUNNING
    await jobRepository.updateStatus(jobId, JobStatusEnum.RUNNING, {
      assignedWorkerId: workerId,
      startedAt: new Date(),
    });

    eventBus.emitEvent("distributed:jobStarted" as any, { jobId, workerId });

    try {
      // 3. Worker Execution Simulation
      logger.info(`⚙️ ExecutionPipeline executing Job [${jobId}] category: '${job.category}' by Worker [${workerId}]`);

      // 4. State transition to COMPLETED
      const completedJob = await jobRepository.updateStatus(jobId, JobStatusEnum.COMPLETED, {
        completedAt: new Date(),
      });

      lockManager.releaseLock(jobId, workerId);
      eventBus.emitEvent("distributed:jobCompleted" as any, completedJob as any);
      return completedJob;
    } catch (err: any) {
      logger.error(`❌ ExecutionPipeline job [${jobId}] failed: ${err.message}`);
      const failedJob = await jobRepository.updateStatus(jobId, JobStatusEnum.FAILED, {
        errorMessage: err.message,
      });

      lockManager.releaseLock(jobId, workerId);
      eventBus.emitEvent("distributed:jobFailed" as any, failedJob as any);
      return failedJob;
    }
  }
}

export const executionPipeline = new ExecutionPipeline();
