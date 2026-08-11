import { Router } from "express";
import { bazaarController } from "../controllers/bazaar.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/bazaar/overview:
 *   get:
 *     summary: Retrieve Bazaar platform overview telemetry
 *     tags: [Bazaar]
 *     responses:
 *       200:
 *         description: Overview metrics successfully retrieved
 */
router.get("/overview", (req, res, next) => bazaarController.getOverview(req, res, next));

/**
 * @openapi
 * /api/v1/bazaar/search:
 *   get:
 *     summary: Search and dynamically rank candidate Bazaar providers
 *     tags: [Bazaar]
 *     parameters:
 *       - in: query
 *         name: capability
 *         schema:
 *           type: string
 *       - in: query
 *         name: network
 *         schema:
 *           type: string
 *       - in: query
 *         name: merchantVerifiedOnly
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rank, latency, price, trust]
 *     responses:
 *       200:
 *         description: Search candidates retrieved and ranked successfully
 */
router.get("/search", (req, res, next) => bazaarController.searchAndRank(req, res, next));

/**
 * @openapi
 * /api/v1/bazaar/capabilities:
 *   get:
 *     summary: List platform capabilities
 *     tags: [Bazaar]
 *   post:
 *     summary: Register a new canonical capability
 *     tags: [Bazaar]
 */
router.get("/capabilities", (req, res, next) => bazaarController.getCapabilities(req, res, next));
router.post("/capabilities", (req, res, next) => bazaarController.createCapability(req, res, next));

/**
 * @openapi
 * /api/v1/bazaar/providers:
 *   get:
 *     summary: List provider listings with pagination and filters
 *     tags: [Bazaar]
 *   post:
 *     summary: Register a new provider listing
 *     tags: [Bazaar]
 */
router.get("/providers", (req, res, next) => bazaarController.getProviders(req, res, next));
router.post("/providers", (req, res, next) => bazaarController.createProvider(req, res, next));

/**
 * @openapi
 * /api/v1/bazaar/providers/{id}:
 *   get:
 *     summary: Get single provider listing by ID
 *     tags: [Bazaar]
 *   put:
 *     summary: Update provider listing
 *     tags: [Bazaar]
 *   delete:
 *     summary: Delete provider listing
 *     tags: [Bazaar]
 */
router.get("/providers/:id", (req, res, next) => bazaarController.getProviderById(req, res, next));
router.put("/providers/:id", (req, res, next) => bazaarController.updateProvider(req, res, next));
router.delete("/providers/:id", (req, res, next) => bazaarController.deleteProvider(req, res, next));

export default router;
