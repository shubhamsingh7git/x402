import { Router } from "express";
import { auditController } from "../controllers/audit.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /audit:
 *   get:
 *     summary: Get paginated audit logs
 *     tags: [Audit]
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
 *         name: fromDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: toDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "-createdAt" }
 *     responses:
 *       200: { description: Audit logs list }
 */
router.get("/", authMiddleware, (req, res, next) => auditController.getAll(req, res, next));

/**
 * @swagger
 * /audit/{id}:
 *   get:
 *     summary: Get audit log entry by ID
 *     tags: [Audit]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Audit log details }
 *       404: { description: Audit log entry not found }
 */
router.get("/:id", authMiddleware, (req, res, next) => auditController.getById(req, res, next));

export default router;
