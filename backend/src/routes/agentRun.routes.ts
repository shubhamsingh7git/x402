import { Router } from "express";
import { agentRunController } from "../controllers/agentRun.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /agent-runs:
 *   get:
 *     summary: Get paginated agent runs history
 *     tags: [Agent Runs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "-createdAt" }
 *     responses:
 *       200: { description: Agent runs list }
 */
router.get("/", authMiddleware, (req, res, next) => agentRunController.getAll(req, res, next));

/**
 * @swagger
 * /agent-runs/{id}:
 *   get:
 *     summary: Get agent run details by ID
 *     tags: [Agent Runs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Agent run details }
 *       404: { description: Agent run not found }
 */
router.get("/:id", authMiddleware, (req, res, next) => agentRunController.getById(req, res, next));

export default router;
