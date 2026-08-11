import { Router } from "express";
import { plannerController } from "../controllers/planner.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/planner/analyze:
 *   post:
 *     summary: Analyze research prompt, extract capabilities, query Bazaar, and build explainable execution plan
 *     tags: [Planner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Perform deep web search and financial analysis for AAPL stock"
 *     responses:
 *       200:
 *         description: Planner execution plan generated successfully
 *       400:
 *         description: Invalid or empty prompt payload
 */
router.post("/analyze", (req, res, next) => plannerController.analyzeAndPlan(req, res, next));

export default router;
