import { Router } from "express";
import { agentsController } from "../controllers/agents.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/agents/registry:
 *   get:
 *     summary: Retrieve registered AI agents and their capabilities
 *     tags: [Agent Platform]
 *   post:
 *     summary: Register a new specialized AI agent
 *     tags: [Agent Platform]
 */
router.get("/registry", (req, res, next) => agentsController.getRegistry(req, res, next));
router.post("/registry", (req, res, next) => agentsController.registerAgent(req, res, next));

/**
 * @openapi
 * /api/v1/agents/orchestrate:
 *   post:
 *     summary: Trigger multi-agent task decomposition, routing, memory sync, and execution
 *     tags: [Agent Platform]
 */
router.post("/orchestrate", (req, res, next) => agentsController.orchestrateSession(req, res, next));

/**
 * @openapi
 * /api/v1/agents/executions:
 *   get:
 *     summary: Retrieve multi-agent execution session logs
 *     tags: [Agent Platform]
 */
router.get("/executions", (req, res, next) => agentsController.getExecutions(req, res, next));

/**
 * @openapi
 * /api/v1/agents/executions/{id}:
 *   get:
 *     summary: Retrieve multi-agent session execution details by ID
 *     tags: [Agent Platform]
 */
router.get("/executions/:id", (req, res, next) => agentsController.getExecutionById(req, res, next));

/**
 * @openapi
 * /api/v1/agents/memory/{sessionId}:
 *   get:
 *     summary: Retrieve shared memory artifacts for a specific agent execution session
 *     tags: [Agent Platform]
 */
router.get("/memory/:sessionId", (req, res, next) => agentsController.getSessionMemory(req, res, next));

/**
 * @openapi
 * /api/v1/agents/approvals:
 *   get:
 *     summary: Retrieve pending human approval requests
 *     tags: [Agent Platform]
 */
router.get("/approvals", (req, res, next) => agentsController.getApprovals(req, res, next));

/**
 * @openapi
 * /api/v1/agents/approvals/{id}/action:
 *   post:
 *     summary: Process human approval decision (APPROVE or REJECT)
 *     tags: [Agent Platform]
 */
router.post("/approvals/:id/action", (req, res, next) => agentsController.processApprovalAction(req, res, next));

/**
 * @openapi
 * /api/v1/agents/governance/evaluate:
 *   post:
 *     summary: Evaluate policy constraints and risk score for a capability
 *     tags: [Agent Platform]
 */
router.post("/governance/evaluate", (req, res, next) => agentsController.evaluateGovernance(req, res, next));

export default router;
