import { jobRepository } from "../repositories/JobRepository";
import { queueRepository } from "../repositories/QueueRepository";
import { JobStatusEnum } from "./JobStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class QueueManager {
  async enqueueJob(data: {
    queueName?: string;
    category?: string;
    payload: Record<string, unknown>;
    priority?: number;
    correlationId?: string;
    idempotencyKey?: string;
  }) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const queueName = data.queueName || "default";
    const category = data.category || "EXECUTION";

    const job = await jobRepository.create({
      jobId,
      queueName,
      category,
      payload: data.payload as any,
      priority: data.priority || 5,
      status: JobStatusEnum.QUEUED,
      correlationId: data.correlationId,
      idempotencyKey: data.idempotencyKey,
      retryCount: 0,
      maxRetries: 3,
    });

    await queueRepository.upsert({ queueName, category, pendingJobs: 1 });

    logger.info(`📥 QueueManager enqueued Job [${jobId}] into Queue '${queueName}'`);
    eventBus.emitEvent("distributed:jobCreated" as any, job as any);
    return job;
  }

  async getJobs(filter: any = {}, limit = 50) {
    return jobRepository.find(filter, limit);
  }

  async getQueues() {
    return queueRepository.find(50);
  }
}

export const queueManager = new QueueManager();
