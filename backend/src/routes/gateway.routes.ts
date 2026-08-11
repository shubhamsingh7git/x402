import { Router } from "express";
import { gatewayController } from "../controllers/gateway.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/gateway/services:
 *   get:
 *     summary: Retrieve registered microservices topology
 *     tags: [API Gateway & Service Mesh]
 */
router.get("/services", (req, res, next) => gatewayController.getServices(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/routes:
 *   get:
 *     summary: Retrieve active route definitions and version mappings
 *     tags: [API Gateway & Service Mesh]
 */
router.get("/routes", (req, res, next) => gatewayController.getRoutes(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/policies:
 *   get:
 *     summary: Retrieve rate limiting and gateway policies
 *     tags: [API Gateway & Service Mesh]
 */
router.get("/policies", (req, res, next) => gatewayController.getPolicies(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/metrics:
 *   get:
 *     summary: Retrieve gateway P50/P95/P99 latency and throughput metrics
 *     tags: [API Gateway & Service Mesh]
 */
router.get("/metrics", (req, res, next) => gatewayController.getMetrics(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/reload:
 *   post:
 *     summary: Perform zero-downtime hot reload of gateway routes and policies
 *     tags: [API Gateway & Service Mesh]
 */
router.post("/reload", (req, res, next) => gatewayController.reload(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/cache/clear:
 *   post:
 *     summary: Clear gateway and response caches
 *     tags: [API Gateway & Service Mesh]
 */
router.post("/cache/clear", (req, res, next) => gatewayController.clearCache(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/health:
 *   get:
 *     summary: Verify API gateway health and uptime
 *     tags: [API Gateway & Service Mesh]
 */
router.get("/health", (req, res, next) => gatewayController.getHealth(req, res, next));

/**
 * @openapi
 * /api/v1/gateway/discovery:
 *   get:
 *     summary: Retrieve service discovery registry mapping
 *     tags: [API Gateway & Service Mesh]
 */
router.get("/discovery", (req, res, next) => gatewayController.getDiscovery(req, res, next));

export default router;
