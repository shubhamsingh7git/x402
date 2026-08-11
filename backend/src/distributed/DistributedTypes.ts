import { JobStatusEnum } from "./JobStatus";
import { WorkerStatusEnum } from "./WorkerStatus";

export interface IJobDTO {
  id?: string;
  jobId: string;
  queueName: string;
  category: string;
  payload: Record<string, unknown>;
  priority: number;
  status: JobStatusEnum;
  correlationId?: string;
  idempotencyKey?: string;
  assignedWorkerId?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  createdAt?: string | Date;
  startedAt?: string | Date;
  completedAt?: string | Date;
}

export interface IQueueDTO {
  id?: string;
  queueName: string;
  category: string;
  pendingJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  maxDepth: number;
  createdAt?: string | Date;
}

export interface IWorkerDTO {
  id?: string;
  workerId: string;
  workerType: string;
  assignedQueues: string[];
  status: WorkerStatusEnum;
  activeJobsCount: number;
  processedJobsCount: number;
  lastHeartbeat?: string | Date;
  uptimeSeconds: number;
  createdAt?: string | Date;
}

export interface IScheduledTaskDTO {
  id?: string;
  taskId: string;
  taskName: string;
  cronExpression: string;
  targetQueue: string;
  jobCategory: string;
  enabled: boolean;
  lastRunAt?: string | Date;
  nextRunAt?: string | Date;
  createdAt?: string | Date;
}

export interface IEventStoreDTO {
  id?: string;
  eventId: string;
  domain: string;
  eventName: string;
  payload: Record<string, unknown>;
  createdAt?: string | Date;
}

export interface IDistributedAnalyticsDTO {
  activeWorkers: number;
  activeQueues: number;
  queuedJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  retryCount: number;
  deadLetterJobs: number;
  schedulerJobs: number;
  averageQueueLatency: number;
  averageExecutionLatency: number;
}
