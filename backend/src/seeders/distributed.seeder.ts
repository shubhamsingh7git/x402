import { queueManager } from "../distributed/QueueManager";
import { workerPool } from "../distributed/WorkerPool";
import { scheduler } from "../distributed/Scheduler";
import { distributedEventBus } from "../distributed/DistributedEventBus";
import { queueRepository } from "../repositories/QueueRepository";
import { logger } from "../utils/logger";

export async function seedDistributedData(): Promise<void> {
  try {
    const count = await queueRepository.count();
    if (count > 0) return;

    logger.info("🌱 Seeding Distributed Infrastructure queues, workers & schedulers...");

    await workerPool.registerWorker("ExecutionWorker", ["high-priority", "execution"]);
    await workerPool.registerWorker("LearningWorker", ["learning", "optimization"]);

    await queueManager.enqueueJob({
      queueName: "high-priority",
      category: "EXECUTION",
      payload: { action: "MULTI_AGENT_ORCHESTRATION", sessionId: "agsession_default" },
      priority: 10,
    });

    await queueManager.enqueueJob({
      queueName: "learning",
      category: "LEARNING",
      payload: { action: "OFFLINE_EXPERIENCE_ANALYSIS" },
      priority: 5,
    });

    await scheduler.registerCronTask("Periodic Offline Experience Learning", "*/15 * * * *", "learning", "LEARNING");
    await scheduler.registerCronTask("Daily Platform Maintenance & Cleanup", "0 0 * * *", "default", "MAINTENANCE");

    await distributedEventBus.publishDomainEvent("distributed", "SYSTEM_BOOTSTRAPPED", { timestamp: new Date() });

    logger.info("✅ Distributed Infrastructure seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Distributed seeder warning: ${err.message}`);
  }
}
