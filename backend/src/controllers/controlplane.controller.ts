import { Request, Response, NextFunction } from "express";
import { organizationService } from "../control-plane/OrganizationService";
import { workspaceService } from "../control-plane/WorkspaceService";
import { projectService } from "../control-plane/ProjectService";
import { teamService } from "../control-plane/TeamService";
import { rbacService } from "../control-plane/RBACService";
import { apiKeyService } from "../control-plane/APIKeyService";
import { secretsManager } from "../control-plane/SecretsManager";
import { featureFlagService } from "../control-plane/FeatureFlagService";
import { quotaService } from "../control-plane/QuotaService";
import { invitationService } from "../control-plane/InvitationService";
import { ApiResponse } from "../utils/ApiResponse";

export class ControlPlaneController {
  async getOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgs = await organizationService.getOrganizations();
      ApiResponse.ok(res, "Organizations retrieved successfully", orgs);
    } catch (error) {
      next(error);
    }
  }

  async createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.createOrganization(req.body);
      ApiResponse.created(res, "Organization created successfully", org);
    } catch (error) {
      next(error);
    }
  }

  async getWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.query.organizationId as string;
      const workspaces = await workspaceService.getWorkspaces(orgId);
      ApiResponse.ok(res, "Workspaces retrieved successfully", workspaces);
    } catch (error) {
      next(error);
    }
  }

  async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ws = await workspaceService.createWorkspace(req.body);
      ApiResponse.created(res, "Workspace created successfully", ws);
    } catch (error) {
      next(error);
    }
  }

  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const wsId = req.query.workspaceId as string;
      const projects = await projectService.getProjects(wsId);
      ApiResponse.ok(res, "Projects retrieved successfully", projects);
    } catch (error) {
      next(error);
    }
  }

  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const proj = await projectService.createProject(req.body);
      ApiResponse.created(res, "Project created successfully", proj);
    } catch (error) {
      next(error);
    }
  }

  async getTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teams = await teamService.getTeams();
      ApiResponse.ok(res, "Teams retrieved successfully", teams);
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await teamService.createTeam(req.body);
      ApiResponse.created(res, "Team created successfully", team);
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await rbacService.getRoles();
      ApiResponse.ok(res, "Roles retrieved successfully", roles);
    } catch (error) {
      next(error);
    }
  }

  async createAPIKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const apiKey = await apiKeyService.createAPIKey(req.body);
      ApiResponse.created(res, "API Key generated successfully", apiKey);
    } catch (error) {
      next(error);
    }
  }

  async storeSecret(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const secret = await secretsManager.storeSecret(req.body);
      ApiResponse.created(res, "Secret stored successfully", secret);
    } catch (error) {
      next(error);
    }
  }

  async getFeatureFlags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flags = await featureFlagService.getFeatureFlags();
      ApiResponse.ok(res, "Feature flags retrieved successfully", flags);
    } catch (error) {
      next(error);
    }
  }

  async updateFeatureFlag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { enabled } = req.body;
      const flag = await featureFlagService.updateFeatureFlagStatus(id, Boolean(enabled));
      ApiResponse.ok(res, "Feature flag updated successfully", flag);
    } catch (error) {
      next(error);
    }
  }

  async getQuotas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quotas = await quotaService.getQuotas();
      ApiResponse.ok(res, "Quotas retrieved successfully", quotas);
    } catch (error) {
      next(error);
    }
  }

  async getInvitations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.params.id as string;
      const invitations = await invitationService.getInvitationsByOrg(orgId);
      ApiResponse.ok(res, "Invitations retrieved successfully", invitations);
    } catch (error) {
      next(error);
    }
  }

  async createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.params.id as string;
      const { email, role } = req.body;
      const invitation = await invitationService.createInvitation(orgId, email, role);
      ApiResponse.created(res, "Invitation sent successfully", invitation);
    } catch (error) {
      next(error);
    }
  }

  async acceptInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token as string;
      const member = await invitationService.acceptInvitation(token);
      ApiResponse.ok(res, "Invitation accepted successfully", member);
    } catch (error) {
      next(error);
    }
  }
}

export const controlPlaneController = new ControlPlaneController();
