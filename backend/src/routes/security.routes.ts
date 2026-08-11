import { Router } from "express";
import { securityController } from "../controllers/security.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/security/health:
 *   get:
 *     summary: Retrieve Zero Trust security engine status
 *     tags: [Enterprise Security]
 */
router.get("/health", (req, res, next) => securityController.getHealth(req, res, next));

/**
 * @openapi
 * /api/v1/security/sessions:
 *   get:
 *     summary: Retrieve active user sessions
 *     tags: [Enterprise Security]
 */
router.get("/sessions", (req, res, next) => securityController.getSessions(req, res, next));

/**
 * @openapi
 * /api/v1/security/mfa:
 *   post:
 *     summary: Enroll MFA device
 *     tags: [Enterprise Security]
 */
router.post("/mfa", (req, res, next) => securityController.mfaSetup(req, res, next));

/**
 * @openapi
 * /api/v1/security/revoke-session:
 *   post:
 *     summary: Revoke active user session
 *     tags: [Enterprise Security]
 */
router.post("/revoke-session", (req, res, next) => securityController.revokeSession(req, res, next));

/**
 * @openapi
 * /api/v1/security/policies:
 *   get:
 *     summary: Retrieve PEP/PDP authorization policies
 *     tags: [Enterprise Security]
 */
router.get("/policies", (req, res, next) => securityController.getPolicies(req, res, next));

/**
 * @openapi
 * /api/v1/security/compliance:
 *   get:
 *     summary: Retrieve regulatory compliance audit reports
 *     tags: [Enterprise Security]
 */
router.get("/compliance", (req, res, next) => securityController.getCompliance(req, res, next));

/**
 * @openapi
 * /api/v1/security/threats:
 *   get:
 *     summary: Retrieve SIEM threat detection events
 *     tags: [Enterprise Security]
 */
router.get("/threats", (req, res, next) => securityController.getThreats(req, res, next));

/**
 * @openapi
 * /api/v1/security/incidents:
 *   get:
 *     summary: Retrieve security incidents roster
 *     tags: [Enterprise Security]
 */
router.get("/incidents", (req, res, next) => securityController.getIncidents(req, res, next));

/**
 * @openapi
 * /api/v1/security/reports:
 *   get:
 *     summary: Retrieve compliance & governance reports
 *     tags: [Enterprise Security]
 */
router.get("/reports", (req, res, next) => securityController.getReports(req, res, next));

/**
 * @openapi
 * /api/v1/security/keys/rotate:
 *   post:
 *     summary: Rotate KMS Master Key
 *     tags: [Enterprise Security]
 */
router.post("/keys/rotate", (req, res, next) => securityController.rotateKeys(req, res, next));

export default router;
