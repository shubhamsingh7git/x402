import { Router } from "express";
import { distributedController } from "../controllers/distributed.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/distributed/jobs:
 *   get:
 *     summary: Retrieve distributed jobs list
 *     tags: [Distributed Infrastructure]
 *   post:
 *     summary: Enqueue a new asynchronous job
 *     tags: [Distributed Infrastructure]
 */
router.get("/jobs", (req, res, next) => distributedController.getJobs(req, res, next));
router.post("/jobs", (req, res, next) => distributedController.createJob(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/jobs/{id}:
 *   get:
 *     summary: Retrieve job details by ID
 *     tags: [Distributed Infrastructure]
 */
router.get("/jobs/:id", (req, res, next) => distributedController.getJobById(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/jobs/{id}/retry:
 *   post:
 *     summary: Retry a failed or dead-letter job
 *     tags: [Distributed Infrastructure]
 */
router.post("/jobs/:id/retry", (req, res, next) => distributedController.retryJob(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/jobs/{id}/cancel:
 *   post:
 *     summary: Cancel a queued job
 *     tags: [Distributed Infrastructure]
 */
router.post("/jobs/:id/cancel", (req, res, next) => distributedController.cancelJob(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/queues:
 *   get:
 *     summary: Retrieve queue metrics and depths
 *     tags: [Distributed Infrastructure]
 */
router.get("/queues", (req, res, next) => distributedController.getQueues(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/workers:
 *   get:
 *     summary: Retrieve worker pool nodes and heartbeats
 *     tags: [Distributed Infrastructure]
 */
router.get("/workers", (req, res, next) => distributedController.getWorkers(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/scheduler:
 *   get:
 *     summary: Retrieve cron and recurring background tasks
 *     tags: [Distributed Infrastructure]
 */
router.get("/scheduler", (req, res, next) => distributedController.getSchedulerTasks(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/dead-letter:
 *   get:
 *     summary: Retrieve Dead Letter Queue failed jobs
 *     tags: [Distributed Infrastructure]
 */
router.get("/dead-letter", (req, res, next) => distributedController.getDeadLetterJobs(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/dead-letter/{id}/replay:
 *   post:
 *     summary: Replay a Dead Letter Queue job
 *     tags: [Distributed Infrastructure]
 */
router.post("/dead-letter/:id/replay", (req, res, next) => distributedController.replayDeadLetterJob(req, res, next));

/**
 * @openapi
 * /api/v1/distributed/events:
 *   get:
 *     summary: Retrieve distributed event stream store
 *     tags: [Distributed Infrastructure]
 */
router.get("/events", (req, res, next) => distributedController.getEvents(req, res, next));

export default router;
