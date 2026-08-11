import { Request, Response, NextFunction } from "express";
import { clusterManager } from "../devops/ClusterManager";
import { deploymentManager } from "../devops/DeploymentManager";
import { pipelineEngine } from "../devops/PipelineEngine";
import { imageSigningService } from "../devops/ImageSigningService";
import { sbomGenerator } from "../devops/SBOMGenerator";
import { gitOpsManager } from "../devops/GitOpsManager";
import { autoscaler } from "../devops/Autoscaler";
import { backupManager } from "../devops/BackupManager";
import { ApiResponse } from "../utils/ApiResponse";

export class DevOpsController {
  async getClusters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clusters = await clusterManager.getClusters();
      ApiResponse.ok(res, "Kubernetes clusters retrieved successfully", clusters);
    } catch (error) {
      next(error);
    }
  }

  async getDeployments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deployments = await deploymentManager.getDeployments();
      ApiResponse.ok(res, "Deployments retrieved successfully", deployments);
    } catch (error) {
      next(error);
    }
  }

  async getPipelines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pipelines = await pipelineEngine.getPipelines();
      ApiResponse.ok(res, "CI/CD pipelines retrieved successfully", pipelines);
    } catch (error) {
      next(error);
    }
  }

  async getReleases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const releases = [
        { releaseName: "x402-api-gateway-chart", chartVersion: "v1.4.2", appVersion: "v1.4.0", namespace: "production", status: "DEPLOYED" },
        { releaseName: "x402-planner-chart", chartVersion: "v2.1.0", appVersion: "v2.1.0", namespace: "production", status: "DEPLOYED" },
        { releaseName: "x402-execution-engine-chart", chartVersion: "v1.8.5", appVersion: "v1.8.5", namespace: "production", status: "DEPLOYED" },
      ];
      ApiResponse.ok(res, "Helm releases retrieved successfully", releases);
    } catch (error) {
      next(error);
    }
  }

  async getGitOps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const apps = await gitOpsManager.getApplications();
      ApiResponse.ok(res, "GitOps applications retrieved successfully", apps);
    } catch (error) {
      next(error);
    }
  }

  async getAutoscaling(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policies = await autoscaler.getPolicies();
      ApiResponse.ok(res, "Autoscaling policies retrieved successfully", policies);
    } catch (error) {
      next(error);
    }
  }

  async getBackups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backups = await backupManager.getBackups();
      ApiResponse.ok(res, "Backups retrieved successfully", backups);
    } catch (error) {
      next(error);
    }
  }

  async getDisasterRecovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dr = {
        primaryRegion: "us-east-1",
        drRegion: "us-west-2",
        rpoSeconds: 300,
        rtoSeconds: 900,
        lastDrTestStatus: "PASSED",
        lastDrTestAt: new Date().toISOString(),
      };
      ApiResponse.ok(res, "Disaster recovery plan retrieved successfully", dr);
    } catch (error) {
      next(error);
    }
  }

  async getSupplyChain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signatures = await imageSigningService.getSignatures();
      const sboms = await sbomGenerator.getSboms();
      ApiResponse.ok(res, "DevSecOps supply chain records retrieved successfully", { signatures, sboms });
    } catch (error) {
      next(error);
    }
  }

  async triggerDeploy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deploymentId, imageTag } = req.body;
      const deployment = await deploymentManager.triggerDeployment(deploymentId, imageTag);
      ApiResponse.ok(res, "Deployment triggered successfully", deployment);
    } catch (error) {
      next(error);
    }
  }

  async triggerRollback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deploymentId } = req.body;
      const rollback = await deploymentManager.rollbackDeployment(deploymentId);
      ApiResponse.ok(res, "Rollback initiated successfully", rollback);
    } catch (error) {
      next(error);
    }
  }

  async triggerBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, targetCluster } = req.body;
      const backup = await backupManager.triggerBackup(name, targetCluster);
      ApiResponse.created(res, "Cluster snapshot backup completed", backup);
    } catch (error) {
      next(error);
    }
  }

  async triggerRestore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { backupId } = req.body;
      const result = await backupManager.restoreBackup(backupId);
      ApiResponse.ok(res, "Cluster snapshot restore completed", result);
    } catch (error) {
      next(error);
    }
  }
}

export const devOpsController = new DevOpsController();
