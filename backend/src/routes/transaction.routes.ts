import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get paginated transactions list
 *     tags: [Transactions]
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
 *         name: merchant
 *         schema: { type: string }
 *       - in: query
 *         name: network
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
 *       200: { description: Transactions list }
 */
router.get("/", authMiddleware, (req, res, next) => transactionController.getAll(req, res, next));

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction details by ID
 *     tags: [Transactions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Transaction details }
 *       404: { description: Transaction not found }
 */
router.get("/:id", authMiddleware, (req, res, next) => transactionController.getById(req, res, next));

export default router;
