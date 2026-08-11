export const DISTRIBUTED_EVENTS = {
  JOB_CREATED: "distributed:jobCreated",
  JOB_STARTED: "distributed:jobStarted",
  JOB_COMPLETED: "distributed:jobCompleted",
  JOB_FAILED: "distributed:jobFailed",
  JOB_RETRIED: "distributed:jobRetried",
  WORKER_REGISTERED: "distributed:workerRegistered",
  WORKER_HEARTBEAT: "distributed:workerHeartbeat",
  WORKER_OFFLINE: "distributed:workerOffline",
  QUEUE_UPDATED: "distributed:queueUpdated",
  SCHEDULER_TRIGGERED: "distributed:schedulerTriggered",
  DEAD_LETTER_CREATED: "distributed:deadLetterCreated",
  DEAD_LETTER_RECOVERED: "distributed:deadLetterRecovered",
} as const;
