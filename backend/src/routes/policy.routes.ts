import { Router } from "express";
import { policyController } from "../controllers/policy.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { createPolicySchema, updatePolicySchema } from "../validators/policy.validator";

const router = Router();

/**
 * @swagger
 * /policies:
 *   get:
 *     summary: Get paginated policies list
 *     tags: [Policies]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "-createdAt" }
 *     responses:
 *       200: { description: Policies list }
 */
router.get("/", authMiddleware, (req, res, next) => policyController.getAll(req, res, next));

/**
 * @swagger
 * /policies/{id}:
 *   get:
 *     summary: Get policy by ID
 *     tags: [Policies]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Policy details }
 *       404: { description: Policy not found }
 */
router.get("/:id", authMiddleware, (req, res, next) => policyController.getById(req, res, next));

/**
 * @swagger
 * /policies:
 *   post:
 *     summary: Create a new merchant policy
 *     tags: [Policies]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [merchant, dailyBudget, transactionLimit]
 *             properties:
 *               merchant: { type: string, example: "66b1a2b3c4d5e6f7a8b9c0d1" }
 *               dailyBudget: { type: number, example: 10.0 }
 *               transactionLimit: { type: number, example: 0.05 }
 *               maxTransactionsPerMinute: { type: number, example: 30 }
 *               killSwitch: { type: boolean, example: false }
 *               enabled: { type: boolean, example: true }
 *     responses:
 *       201: { description: Policy created }
 *       400: { description: Validation error }
 *       409: { description: Policy already exists for this merchant }
 */
router.post("/", authMiddleware, validate(createPolicySchema), (req, res, next) =>
  policyController.create(req, res, next)
);

/**
 * @swagger
 * /policies/{id}:
 *   put:
 *     summary: Update policy by ID
 *     tags: [Policies]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Policy updated }
 *       404: { description: Policy not found }
 */
router.put("/:id", authMiddleware, validate(updatePolicySchema), (req, res, next) =>
  policyController.update(req, res, next)
);

router.patch("/:id/toggle", authMiddleware, (req, res, next) => policyController.toggle(req, res, next));

router.patch("/:id/kill-switch", authMiddleware, (req, res, next) =>
  policyController.toggleKillSwitch(req, res, next)
);

/**
 * @swagger
 * /policies/{id}:
 *   delete:
 *     summary: Delete policy by ID
 *     tags: [Policies]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Policy deleted }
 *       404: { description: Policy not found }
 */
router.delete("/:id", authMiddleware, (req, res, next) => policyController.delete(req, res, next));

export default router;
