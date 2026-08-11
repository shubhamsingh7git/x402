import { Router } from "express";
import { intelligenceController } from "../controllers/intelligence.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/intelligence/search:
 *   get:
 *     summary: Contextual natural language semantic search across long-term memories
 *     tags: [Enterprise Intelligence]
 */
router.get("/search", (req, res, next) => intelligenceController.searchSemanticMemory(req, res, next));

/**
 * @openapi
 * /api/v1/intelligence/memory:
 *   get:
 *     summary: Retrieve long-term semantic, episodic, and procedural memory records
 *     tags: [Enterprise Intelligence]
 */
router.get("/memory", (req, res, next) => intelligenceController.getMemories(req, res, next));

/**
 * @openapi
 * /api/v1/intelligence/knowledge:
 *   get:
 *     summary: Retrieve Knowledge Graph nodes and edges
 *     tags: [Enterprise Intelligence]
 */
router.get("/knowledge", (req, res, next) => intelligenceController.getKnowledgeGraph(req, res, next));

/**
 * @openapi
 * /api/v1/intelligence/recommendations:
 *   get:
 *     summary: Retrieve categorized optimization recommendations (Operational, Cost, Quality, Security, Governance)
 *     tags: [Enterprise Intelligence]
 */
router.get("/recommendations", (req, res, next) => intelligenceController.getRecommendations(req, res, next));

/**
 * @openapi
 * /api/v1/intelligence/recommendations/{id}/apply:
 *   post:
 *     summary: Apply an approved optimization recommendation
 *     tags: [Enterprise Intelligence]
 */
router.post("/recommendations/:id/apply", (req, res, next) => intelligenceController.applyRecommendation(req, res, next));

/**
 * @openapi
 * /api/v1/intelligence/learning:
 *   get:
 *     summary: Retrieve offline learning engine performance metrics
 *     tags: [Enterprise Intelligence]
 */
router.get("/learning", (req, res, next) => intelligenceController.getLearningMetrics(req, res, next));

export default router;
