import { Router } from "express";
import { observabilityController } from "../controllers/observability.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/observability/health:
 *   get:
 *     summary: Retrieve system health status topology
 *     tags: [Enterprise Observability]
 */
router.get("/health", (req, res, next) => observabilityController.getHealth(req, res, next));

/**
 * @openapi
 * /api/v1/observability/metrics:
 *   get:
 *     summary: Retrieve platform metrics time-series
 *     tags: [Enterprise Observability]
 */
router.get("/metrics", (req, res, next) => observabilityController.getMetrics(req, res, next));

/**
 * @openapi
 * /api/v1/observability/traces:
 *   get:
 *     summary: Retrieve distributed traces list
 *     tags: [Enterprise Observability]
 */
router.get("/traces", (req, res, next) => observabilityController.getTraces(req, res, next));

/**
 * @openapi
 * /api/v1/observability/traces/{id}:
 *   get:
 *     summary: Retrieve trace details and spans
 *     tags: [Enterprise Observability]
 */
router.get("/traces/:id", (req, res, next) => observabilityController.getTraceById(req, res, next));

/**
 * @openapi
 * /api/v1/observability/logs:
 *   get:
 *     summary: Retrieve centralized structured logs
 *     tags: [Enterprise Observability]
 */
router.get("/logs", (req, res, next) => observabilityController.getLogs(req, res, next));

/**
 * @openapi
 * /api/v1/observability/alerts:
 *   get:
 *     summary: Retrieve active and historical alerts
 *     tags: [Enterprise Observability]
 */
router.get("/alerts", (req, res, next) => observabilityController.getAlerts(req, res, next));

/**
 * @openapi
 * /api/v1/observability/alert-rules:
 *   get:
 *     summary: Retrieve configured alert rules
 *     tags: [Enterprise Observability]
 */
router.get("/alert-rules", (req, res, next) => observabilityController.getAlertRules(req, res, next));

/**
 * @openapi
 * /api/v1/observability/incidents:
 *   get:
 *     summary: Retrieve incidents list
 *     tags: [Enterprise Observability]
 *   post:
 *     summary: Open a new operational incident
 *     tags: [Enterprise Observability]
 */
router.get("/incidents", (req, res, next) => observabilityController.getIncidents(req, res, next));
router.post("/incidents", (req, res, next) => observabilityController.openIncident(req, res, next));

/**
 * @openapi
 * /api/v1/observability/dependencies:
 *   get:
 *     summary: Retrieve service dependency graph
 *     tags: [Enterprise Observability]
 */
router.get("/dependencies", (req, res, next) => observabilityController.getDependencies(req, res, next));

/**
 * @openapi
 * /api/v1/observability/slos:
 *   get:
 *     summary: Retrieve SLO/SLA and error budget metrics
 *     tags: [Enterprise Observability]
 */
router.get("/slos", (req, res, next) => observabilityController.getSlos(req, res, next));

/**
 * @openapi
 * /api/v1/observability/dashboard:
 *   get:
 *     summary: Retrieve unified observability dashboard telemetry
 *     tags: [Enterprise Observability]
 */
router.get("/dashboard", (req, res, next) => observabilityController.getDashboard(req, res, next));

export default router;
