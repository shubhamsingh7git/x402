import { Router } from "express";
import { productionController } from "../controllers/production.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/production/readiness:
 *   get:
 *     summary: Retrieve operational readiness checklists and overall score
 *     tags: [Production Platform]
 */
router.get("/readiness", (req, res, next) => productionController.getReadiness(req, res, next));

/**
 * @openapi
 * /api/v1/production/performance:
 *   get:
 *     summary: Retrieve performance engineering profile and latency metrics
 *     tags: [Production Platform]
 */
router.get("/performance", (req, res, next) => productionController.getPerformance(req, res, next));

/**
 * @openapi
 * /api/v1/production/capacity:
 *   get:
 *     summary: Retrieve infrastructure capacity planning recommendations
 *     tags: [Production Platform]
 */
router.get("/capacity", (req, res, next) => productionController.getCapacity(req, res, next));

/**
 * @openapi
 * /api/v1/production/availability:
 *   get:
 *     summary: Retrieve high availability multi-region topology
 *     tags: [Production Platform]
 */
router.get("/availability", (req, res, next) => productionController.getAvailability(req, res, next));

/**
 * @openapi
 * /api/v1/production/failover:
 *   get:
 *     summary: Retrieve regional failover policies
 *     tags: [Production Platform]
 */
router.get("/failover", (req, res, next) => productionController.getFailover(req, res, next));

/**
 * @openapi
 * /api/v1/production/disaster-recovery:
 *   get:
 *     summary: Retrieve disaster recovery RPO/RTO validation reports
 *     tags: [Production Platform]
 */
router.get("/disaster-recovery", (req, res, next) => productionController.getDisasterRecovery(req, res, next));

/**
 * @openapi
 * /api/v1/production/chaos:
 *   get:
 *     summary: Retrieve chaos engineering experiments roster
 *     tags: [Production Platform]
 */
router.get("/chaos", (req, res, next) => productionController.getChaos(req, res, next));

/**
 * @openapi
 * /api/v1/production/releases:
 *   get:
 *     summary: Retrieve release governance records
 *     tags: [Production Platform]
 */
router.get("/releases", (req, res, next) => productionController.getReleases(req, res, next));

/**
 * @openapi
 * /api/v1/production/runbooks:
 *   get:
 *     summary: Retrieve operational runbooks console
 *     tags: [Production Platform]
 */
router.get("/runbooks", (req, res, next) => productionController.getRunbooks(req, res, next));

/**
 * @openapi
 * /api/v1/production/certification:
 *   get:
 *     summary: Retrieve enterprise production certification scorecard
 *     tags: [Production Platform]
 */
router.get("/certification", (req, res, next) => productionController.getCertification(req, res, next));

/**
 * @openapi
 * /api/v1/production/releases:
 *   post:
 *     summary: Submit production change request release approval
 *     tags: [Production Platform]
 */
router.post("/releases", (req, res, next) => productionController.triggerRelease(req, res, next));

/**
 * @openapi
 * /api/v1/production/chaos/run:
 *   post:
 *     summary: Run controlled chaos fault injection experiment
 *     tags: [Production Platform]
 */
router.post("/chaos/run", (req, res, next) => productionController.runChaos(req, res, next));

/**
 * @openapi
 * /api/v1/production/failover/test:
 *   post:
 *     summary: Test regional failover policy
 *     tags: [Production Platform]
 */
router.post("/failover/test", (req, res, next) => productionController.testFailover(req, res, next));

/**
 * @openapi
 * /api/v1/production/recovery/test:
 *   post:
 *     summary: Trigger disaster recovery RPO/RTO validation test
 *     tags: [Production Platform]
 */
router.post("/recovery/test", (req, res, next) => productionController.testRecovery(req, res, next));

export default router;
