import { Router } from "express";
import { controlPlaneController } from "../controllers/controlplane.controller";
import { tenantContextMiddleware } from "../control-plane/TenantContextMiddleware";

const router = Router();

router.use(tenantContextMiddleware);

/**
 * @openapi
 * /api/v1/control-plane/organizations:
 *   get:
 *     summary: Retrieve multi-tenant organizations
 *     tags: [Enterprise Control Plane]
 *   post:
 *     summary: Create a new Organization
 *     tags: [Enterprise Control Plane]
 */
router.get("/organizations", (req, res, next) => controlPlaneController.getOrganizations(req, res, next));
router.post("/organizations", (req, res, next) => controlPlaneController.createOrganization(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/organizations/{id}/invitations:
 *   get:
 *     summary: Retrieve pending organization invitations
 *     tags: [Enterprise Control Plane]
 *   post:
 *     summary: Send an organization invitation
 *     tags: [Enterprise Control Plane]
 */
router.get("/organizations/:id/invitations", (req, res, next) => controlPlaneController.getInvitations(req, res, next));
router.post("/organizations/:id/invitations", (req, res, next) => controlPlaneController.createInvitation(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/invitations/{token}/accept:
 *   post:
 *     summary: Accept an organization invitation token
 *     tags: [Enterprise Control Plane]
 */
router.post("/invitations/:token/accept", (req, res, next) => controlPlaneController.acceptInvitation(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/workspaces:
 *   get:
 *     summary: Retrieve organization workspaces
 *     tags: [Enterprise Control Plane]
 *   post:
 *     summary: Create a new Workspace
 *     tags: [Enterprise Control Plane]
 */
router.get("/workspaces", (req, res, next) => controlPlaneController.getWorkspaces(req, res, next));
router.post("/workspaces", (req, res, next) => controlPlaneController.createWorkspace(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/projects:
 *   get:
 *     summary: Retrieve workspace projects
 *     tags: [Enterprise Control Plane]
 *   post:
 *     summary: Create a new Project
 *     tags: [Enterprise Control Plane]
 */
router.get("/projects", (req, res, next) => controlPlaneController.getProjects(req, res, next));
router.post("/projects", (req, res, next) => controlPlaneController.createProject(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/teams:
 *   get:
 *     summary: Retrieve enterprise teams
 *     tags: [Enterprise Control Plane]
 *   post:
 *     summary: Create a new Team
 *     tags: [Enterprise Control Plane]
 */
router.get("/teams", (req, res, next) => controlPlaneController.getTeams(req, res, next));
router.post("/teams", (req, res, next) => controlPlaneController.createTeam(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/roles:
 *   get:
 *     summary: Retrieve RBAC v2 roles and permissions
 *     tags: [Enterprise Control Plane]
 */
router.get("/roles", (req, res, next) => controlPlaneController.getRoles(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/api-keys:
 *   post:
 *     summary: Generate a scoped API Key
 *     tags: [Enterprise Control Plane]
 */
router.post("/api-keys", (req, res, next) => controlPlaneController.createAPIKey(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/secrets:
 *   post:
 *     summary: Store or rotate an encrypted secret
 *     tags: [Enterprise Control Plane]
 */
router.post("/secrets", (req, res, next) => controlPlaneController.storeSecret(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/feature-flags:
 *   get:
 *     summary: Retrieve platform feature flags
 *     tags: [Enterprise Control Plane]
 */
router.get("/feature-flags", (req, res, next) => controlPlaneController.getFeatureFlags(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/feature-flags/{id}:
 *   patch:
 *     summary: Update feature flag enabled status
 *     tags: [Enterprise Control Plane]
 */
router.patch("/feature-flags/:id", (req, res, next) => controlPlaneController.updateFeatureFlag(req, res, next));

/**
 * @openapi
 * /api/v1/control-plane/quotas:
 *   get:
 *     summary: Retrieve tenant quotas and daily usage policies
 *     tags: [Enterprise Control Plane]
 */
router.get("/quotas", (req, res, next) => controlPlaneController.getQuotas(req, res, next));

export default router;
