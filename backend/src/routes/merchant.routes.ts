import { Router } from "express";
import { merchantController } from "../controllers/merchant.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { createMerchantSchema, updateMerchantSchema } from "../validators/merchant.validator";

const router = Router();

/**
 * @swagger
 * /merchants:
 *   get:
 *     summary: Get paginated merchants list
 *     tags: [Merchants]
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
 *         name: network
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "-createdAt" }
 *     responses:
 *       200: { description: Merchants list }
 */
router.get("/", authMiddleware, (req, res, next) => merchantController.getAll(req, res, next));

/**
 * @swagger
 * /merchants/{id}:
 *   get:
 *     summary: Get merchant by ID
 *     tags: [Merchants]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Merchant details }
 *       404: { description: Merchant not found }
 */
router.get("/:id", authMiddleware, (req, res, next) => merchantController.getById(req, res, next));

/**
 * @swagger
 * /merchants:
 *   post:
 *     summary: Create a new merchant (starts in PENDING status)
 *     tags: [Merchants]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [alias, walletAddress, network]
 *             properties:
 *               alias: { type: string, example: "OpenAI API" }
 *               walletAddress: { type: string, example: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B" }
 *               network: { type: string, example: "Base Sepolia Testnet" }
 *     responses:
 *       201: { description: Merchant created }
 *       409: { description: Merchant already exists }
 */
router.post("/", authMiddleware, validate(createMerchantSchema), (req, res, next) =>
  merchantController.create(req, res, next)
);

/**
 * @swagger
 * /merchants/{id}/verify:
 *   post:
 *     summary: Trigger asynchronous merchant strategy verification
 *     tags: [Merchants]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: force
 *         schema: { type: boolean, default: false }
 *     responses:
 *       200: { description: Merchant verification result }
 *       404: { description: Merchant not found }
 */
router.post("/:id/verify", authMiddleware, (req, res, next) =>
  merchantController.verify(req, res, next)
);

/**
 * @swagger
 * /merchants/{id}:
 *   put:
 *     summary: Update merchant by ID
 *     tags: [Merchants]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias: { type: string }
 *               walletAddress: { type: string }
 *               network: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Merchant updated }
 *       404: { description: Merchant not found }
 */
router.put("/:id", authMiddleware, validate(updateMerchantSchema), (req, res, next) =>
  merchantController.update(req, res, next)
);

/**
 * @swagger
 * /merchants/{id}:
 *   delete:
 *     summary: Soft delete merchant by ID
 *     tags: [Merchants]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Merchant soft-deleted }
 *       404: { description: Merchant not found }
 */
router.delete("/:id", authMiddleware, (req, res, next) => merchantController.delete(req, res, next));

export default router;
