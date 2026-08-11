import { scheduledTaskRepository } from "../repositories/ScheduledTaskRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class Scheduler {
  async registerCronTask(taskName: string, cronExpression: string, targetQueue = "default", jobCategory = "MAINTENANCE") {
    const taskId = `sched_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const task = await scheduledTaskRepository.upsert({
      taskId,
      taskName,
      cronExpression,
      targetQueue,
      jobCategory,
      enabled: true,
      nextRunAt: new Date(Date.now() + 60000),
    });

    logger.info(`⏰ Scheduler registered task [${taskId}] ('${taskName}') cron: '${cronExpression}'`);
    eventBus.emitEvent("distributed:schedulerTriggered" as any, task as any);
    return task;
  }

  async getScheduledTasks() {
    return scheduledTaskRepository.find(50);
  }
}

export const scheduler = new Scheduler();
