import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard summary statistics
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard summary statistics }
 */
router.get("/", authMiddleware, (req, res, next) => dashboardController.getOverview(req, res, next));

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dynamic dashboard overview stats computed from MongoDB
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard overview statistics }
 */
router.get("/overview", authMiddleware, (req, res, next) => dashboardController.getOverview(req, res, next));

/**
 * @swagger
 * /dashboard/charts:
 *   get:
 *     summary: Get dynamic dashboard chart aggregations computed from MongoDB
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard charts data }
 */
router.get("/charts", authMiddleware, (req, res, next) => dashboardController.getCharts(req, res, next));

export default router;
