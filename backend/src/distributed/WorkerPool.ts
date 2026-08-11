import { workerRepository } from "../repositories/WorkerRepository";
import { WorkerStatusEnum } from "./WorkerStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class WorkerPool {
  async registerWorker(workerType = "ExecutionWorker", assignedQueues = ["default", "high-priority"]) {
    const workerId = `wrk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const worker = await workerRepository.upsert({
      workerId,
      workerType,
      assignedQueues,
      status: WorkerStatusEnum.IDLE,
      activeJobsCount: 0,
      processedJobsCount: 0,
      lastHeartbeat: new Date(),
      uptimeSeconds: 0,
    });

    logger.info(`👷 WorkerPool registered Worker [${workerId}] (${workerType})`);
    eventBus.emitEvent("distributed:workerRegistered" as any, worker as any);
    return worker;
  }

  async getWorkers() {
    return workerRepository.find(50);
  }
}

export const workerPool = new WorkerPool();
