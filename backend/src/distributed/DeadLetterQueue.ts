import { jobRepository } from "../repositories/JobRepository";
import { JobStatusEnum } from "./JobStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class DeadLetterQueue {
  async getDeadLetterJobs(limit = 50) {
    return jobRepository.find({ status: JobStatusEnum.DEAD_LETTER }, limit);
  }

  async replayDeadLetterJob(jobId: string) {
    const job = await jobRepository.findByJobId(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found in Dead Letter Queue`);

    const replayedJob = await jobRepository.updateStatus(jobId, JobStatusEnum.QUEUED, {
      retryCount: 0,
      errorMessage: undefined,
    });

    logger.info(`♻️ DeadLetterQueue replayed Job [${jobId}] back into Queue '${job.queueName}'`);
    eventBus.emitEvent("distributed:deadLetterRecovered" as any, replayedJob as any);
    return replayedJob;
  }
}

export const deadLetterQueue = new DeadLetterQueue();
