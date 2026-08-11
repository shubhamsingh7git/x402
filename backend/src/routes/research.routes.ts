import { Router } from "express";
import { researchController } from "../controllers/research.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { researchSchema } from "../validators/research.validator";

const router = Router();

// ─── Static Literal Routes (MUST PRECEDE PARAMETER ROUTES) ───────

/**
 * @swagger
 * /research/runs:
 *   get:
 *     summary: Get research runs list
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of research runs }
 */
router.get("/runs", authMiddleware, (req, res, next) => researchController.listRuns(req, res, next));

/**
 * @swagger
 * /research/plan:
 *   post:
 *     summary: Generate an execution plan for a research prompt
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Generated plan }
 */
router.post("/plan", authMiddleware, (req, res, next) => researchController.generatePlan(req, res, next));

/**
 * @swagger
 * /research/execute:
 *   post:
 *     summary: Execute a generated research plan
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Execution started }
 */
router.post("/execute", authMiddleware, (req, res, next) => researchController.executePlan(req, res, next));

/**
 * @swagger
 * /research:
 *   post:
 *     summary: Initiate an AI Agent research pipeline
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query]
 *             properties:
 *               query: { type: string, example: "Research Tesla AI Strategy" }
 *     responses:
 *       200: { description: Research pipeline started asynchronously }
 *       400: { description: Validation error }
 */
router.post("/", authMiddleware, validate(researchSchema), (req, res, next) =>
  researchController.startResearch(req, res, next)
);

// ─── Dynamic Parameter Routes ───────────────────────────────────

/**
 * @swagger
 * /research/{runId}:
 *   get:
 *     summary: Get agent run details and steps
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Agent run details }
 *       404: { description: Run not found }
 */
router.get("/:runId", authMiddleware, (req, res, next) => researchController.getRunDetails(req, res, next));

/**
 * @swagger
 * /research/{runId}/timeline:
 *   get:
 *     summary: Get timeline events for an agent run
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Run timeline events }
 *       404: { description: Run not found }
 */
router.get("/:runId/timeline", authMiddleware, (req, res, next) =>
  researchController.getRunTimeline(req, res, next)
);

/**
 * @swagger
 * /research/{runId}/result:
 *   get:
 *     summary: Get final research summary output
 *     tags: [AI Agent Research]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Research result summary }
 *       404: { description: Run not found }
 */
router.get("/:runId/result", authMiddleware, (req, res, next) =>
  researchController.getRunResult(req, res, next)
);

export default router;
