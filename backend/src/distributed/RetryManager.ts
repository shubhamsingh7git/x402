import { jobRepository } from "../repositories/JobRepository";
import { JobStatusEnum } from "./JobStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class RetryManager {
  async retryJob(jobId: string) {
    const job = await jobRepository.findByJobId(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found`);

    if (job.retryCount >= job.maxRetries) {
      logger.warn(`⚠️ RetryManager: Job [${jobId}] exceeded max retries (${job.maxRetries}) → Moving to DEAD_LETTER`);
      const dlqJob = await jobRepository.updateStatus(jobId, JobStatusEnum.DEAD_LETTER);
      eventBus.emitEvent("distributed:deadLetterCreated" as any, dlqJob as any);
      return dlqJob;
    }

    const nextRetry = job.retryCount + 1;
    const retriedJob = await jobRepository.updateStatus(jobId, JobStatusEnum.RETRYING, {
      retryCount: nextRetry,
    });

    logger.info(`🔄 RetryManager retrying Job [${jobId}] attempt (${nextRetry}/${job.maxRetries})`);
    eventBus.emitEvent("distributed:jobRetried" as any, retriedJob as any);
    return retriedJob;
  }
}

export const retryManager = new RetryManager();
