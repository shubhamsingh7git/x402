import { Router } from "express";
import { healthController } from "../controllers/health.controller";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Comprehensive system health report
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System health report generated
 */
router.get("/", healthController.check);

/**
 * @swagger
 * /live:
 *   get:
 *     summary: Liveness probe verifying server process is running
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is alive
 */
router.get("/live", healthController.liveness);

/**
 * @swagger
 * /ready:
 *   get:
 *     summary: Readiness probe inspecting backend service dependencies
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is ready
 *       503:
 *         description: Server is not ready
 */
router.get("/ready", healthController.readiness);

export { healthController };
export default router;
