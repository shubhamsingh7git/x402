import { Router } from "express";
import { marketplaceController } from "../controllers/marketplace.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/marketplace/analytics:
 *   get:
 *     summary: Retrieve executive AI Service Marketplace performance analytics
 *     tags: [Marketplace]
 *     responses:
 *       200:
 *         description: Marketplace analytics retrieved
 */
router.get("/analytics", (req, res, next) => marketplaceController.getAnalytics(req, res, next));

/**
 * @openapi
 * /api/v1/marketplace/search:
 *   get:
 *     summary: Search marketplace providers with category, capability, and query filters
 *     tags: [Marketplace]
 *     responses:
 *       200:
 *         description: Providers list retrieved
 */
router.get("/search", (req, res, next) => marketplaceController.searchProviders(req, res, next));

/**
 * @openapi
 * /api/v1/marketplace/providers:
 *   get:
 *     summary: List marketplace provider profiles
 *     tags: [Marketplace]
 *   post:
 *     summary: Create new provider profile for self-service onboarding
 *     tags: [Marketplace]
 */
router.get("/providers", (req, res, next) => marketplaceController.searchProviders(req, res, next));
router.post("/providers", (req, res, next) => marketplaceController.createProvider(req, res, next));

/**
 * @openapi
 * /api/v1/marketplace/providers/{id}:
 *   get:
 *     summary: Retrieve provider profile details, SLA profile, pricing policy, and reviews
 *     tags: [Marketplace]
 */
router.get("/providers/:id", (req, res, next) => marketplaceController.getProviderById(req, res, next));

/**
 * @openapi
 * /api/v1/marketplace/providers/{id}/status:
 *   patch:
 *     summary: Update provider lifecycle status and synchronize with Bazaar
 *     tags: [Marketplace]
 */
router.patch("/providers/:id/status", (req, res, next) => marketplaceController.updateStatus(req, res, next));

/**
 * @openapi
 * /api/v1/marketplace/reviews:
 *   post:
 *     summary: Post a review and recalculate provider reputation score
 *     tags: [Marketplace]
 */
router.post("/reviews", (req, res, next) => marketplaceController.addReview(req, res, next));

export default router;
