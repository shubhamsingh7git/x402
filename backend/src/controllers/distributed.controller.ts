import { Request, Response, NextFunction } from "express";
import { queueManager } from "../distributed/QueueManager";
import { workerPool } from "../distributed/WorkerPool";
import { retryManager } from "../distributed/RetryManager";
import { deadLetterQueue } from "../distributed/DeadLetterQueue";
import { scheduler } from "../distributed/Scheduler";
import { distributedEventBus } from "../distributed/DistributedEventBus";
import { jobRepository } from "../repositories/JobRepository";
import { ApiResponse } from "../utils/ApiResponse";

export class DistributedController {
  async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const jobs = await queueManager.getJobs({}, limit);
      ApiResponse.ok(res, "Distributed jobs retrieved successfully", jobs);
    } catch (error) {
      next(error);
    }
  }

  async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await queueManager.enqueueJob(req.body);
      ApiResponse.created(res, "Job enqueued successfully", job);
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const job = await jobRepository.findByJobId(id);
      if (!job) {
        ApiResponse.error(res, 404, "Job not found");
        return;
      }
      ApiResponse.ok(res, "Job details retrieved successfully", job);
    } catch (error) {
      next(error);
    }
  }

  async retryJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const job = await retryManager.retryJob(id);
      ApiResponse.ok(res, "Job retried successfully", job);
    } catch (error) {
      next(error);
    }
  }

  async cancelJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const job = await jobRepository.updateStatus(id, "CANCELLED");
      ApiResponse.ok(res, "Job cancelled successfully", job);
    } catch (error) {
      next(error);
    }
  }

  async getQueues(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queues = await queueManager.getQueues();
      ApiResponse.ok(res, "Queues retrieved successfully", queues);
    } catch (error) {
      next(error);
    }
  }

  async getWorkers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workers = await workerPool.getWorkers();
      ApiResponse.ok(res, "Workers retrieved successfully", workers);
    } catch (error) {
      next(error);
    }
  }

  async getSchedulerTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await scheduler.getScheduledTasks();
      ApiResponse.ok(res, "Scheduled tasks retrieved successfully", tasks);
    } catch (error) {
      next(error);
    }
  }

  async getDeadLetterJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dlqJobs = await deadLetterQueue.getDeadLetterJobs();
      ApiResponse.ok(res, "Dead Letter Queue jobs retrieved successfully", dlqJobs);
    } catch (error) {
      next(error);
    }
  }

  async replayDeadLetterJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const replayed = await deadLetterQueue.replayDeadLetterJob(id);
      ApiResponse.ok(res, "Dead Letter job replayed successfully", replayed);
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await distributedEventBus.getEvents(50);
      ApiResponse.ok(res, "Distributed events retrieved successfully", events);
    } catch (error) {
      next(error);
    }
  }
}

export const distributedController = new DistributedController();
