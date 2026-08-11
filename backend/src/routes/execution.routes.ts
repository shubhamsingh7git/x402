import { Router } from "express";
import { executionController } from "../controllers/execution.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/execution/metrics:
 *   get:
 *     summary: Retrieve execution engine live telemetry metrics
 *     tags: [Execution]
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 */
router.get("/metrics", (req, res, next) => executionController.getMetrics(req, res, next));

/**
 * @openapi
 * /api/v1/execution/history:
 *   get:
 *     summary: Retrieve persisted multi-provider execution history
 *     tags: [Execution]
 *     responses:
 *       200:
 *         description: Execution history retrieved successfully
 */
router.get("/history", (req, res, next) => executionController.getHistory(req, res, next));

/**
 * @openapi
 * /api/v1/execution/test:
 *   post:
 *     summary: Trigger test multi-provider orchestration with automatic failover & strategies
 *     tags: [Execution]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capability:
 *                 type: string
 *                 example: "financial-analysis"
 *               strategy:
 *                 type: string
 *                 enum: [SEQUENTIAL, PARALLEL, BALANCED, CONSENSUS]
 *     responses:
 *       200:
 *         description: Test execution completed
 */
router.post("/test", (req, res, next) => executionController.runTestExecution(req, res, next));

/**
 * @openapi
 * /api/v1/execution/{id}:
 *   get:
 *     summary: Retrieve execution session details by ID
 *     tags: [Execution]
 *     responses:
 *       200:
 *         description: Execution session retrieved
 *       404:
 *         description: Session not found
 */
router.get("/:id", (req, res, next) => executionController.getSessionById(req, res, next));

/**
 * @openapi
 * /api/v1/execution:
 *   get:
 *     summary: Alias to list execution history
 *     tags: [Execution]
 */
router.get("/", (req, res, next) => executionController.getHistory(req, res, next));

export default router;
