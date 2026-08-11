import { Router } from "express";
import { devOpsController } from "../controllers/devops.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/devops/clusters:
 *   get:
 *     summary: Retrieve Kubernetes clusters roster
 *     tags: [Platform DevOps]
 */
router.get("/clusters", (req, res, next) => devOpsController.getClusters(req, res, next));

/**
 * @openapi
 * /api/v1/devops/deployments:
 *   get:
 *     summary: Retrieve workload deployments
 *     tags: [Platform DevOps]
 */
router.get("/deployments", (req, res, next) => devOpsController.getDeployments(req, res, next));

/**
 * @openapi
 * /api/v1/devops/pipelines:
 *   get:
 *     summary: Retrieve CI/CD pipelines
 *     tags: [Platform DevOps]
 */
router.get("/pipelines", (req, res, next) => devOpsController.getPipelines(req, res, next));

/**
 * @openapi
 * /api/v1/devops/releases:
 *   get:
 *     summary: Retrieve Helm releases
 *     tags: [Platform DevOps]
 */
router.get("/releases", (req, res, next) => devOpsController.getReleases(req, res, next));

/**
 * @openapi
 * /api/v1/devops/gitops:
 *   get:
 *     summary: Retrieve GitOps application sync status
 *     tags: [Platform DevOps]
 */
router.get("/gitops", (req, res, next) => devOpsController.getGitOps(req, res, next));

/**
 * @openapi
 * /api/v1/devops/autoscaling:
 *   get:
 *     summary: Retrieve HPA autoscaling policies
 *     tags: [Platform DevOps]
 */
router.get("/autoscaling", (req, res, next) => devOpsController.getAutoscaling(req, res, next));

/**
 * @openapi
 * /api/v1/devops/backups:
 *   get:
 *     summary: Retrieve cluster backups
 *     tags: [Platform DevOps]
 */
router.get("/backups", (req, res, next) => devOpsController.getBackups(req, res, next));

/**
 * @openapi
 * /api/v1/devops/disaster-recovery:
 *   get:
 *     summary: Retrieve disaster recovery plan
 *     tags: [Platform DevOps]
 */
router.get("/disaster-recovery", (req, res, next) => devOpsController.getDisasterRecovery(req, res, next));

/**
 * @openapi
 * /api/v1/devops/supply-chain:
 *   get:
 *     summary: Retrieve DevSecOps supply chain SBOMs and signatures
 *     tags: [Platform DevOps]
 */
router.get("/supply-chain", (req, res, next) => devOpsController.getSupplyChain(req, res, next));

/**
 * @openapi
 * /api/v1/devops/deploy:
 *   post:
 *     summary: Trigger progressive deployment rollout
 *     tags: [Platform DevOps]
 */
router.post("/deploy", (req, res, next) => devOpsController.triggerDeploy(req, res, next));

/**
 * @openapi
 * /api/v1/devops/rollback:
 *   post:
 *     summary: Initiate deployment rollback
 *     tags: [Platform DevOps]
 */
router.post("/rollback", (req, res, next) => devOpsController.triggerRollback(req, res, next));

/**
 * @openapi
 * /api/v1/devops/backup:
 *   post:
 *     summary: Trigger cluster snapshot backup
 *     tags: [Platform DevOps]
 */
router.post("/backup", (req, res, next) => devOpsController.triggerBackup(req, res, next));

/**
 * @openapi
 * /api/v1/devops/restore:
 *   post:
 *     summary: Restore cluster snapshot
 *     tags: [Platform DevOps]
 */
router.post("/restore", (req, res, next) => devOpsController.triggerRestore(req, res, next));

export default router;
