import { clusterRepository } from "../repositories/ClusterRepository";
import { deploymentRepository } from "../repositories/DeploymentRepository";
import { pipelineRepository } from "../repositories/PipelineRepository";
import { gitOpsRepository } from "../repositories/GitOpsRepository";
import { autoscalingRepository } from "../repositories/AutoscalingRepository";
import { backupRepository } from "../repositories/BackupRepository";
import { ClusterStatusEnum, DeploymentStatusEnum, PipelineStatusEnum } from "../devops/ClusterStatus";
import { logger } from "../utils/logger";

export async function seedDevOpsData(): Promise<void> {
  try {
    const count = await clusterRepository.count();
    if (count > 0) return;

    logger.info("🌱 Seeding Enterprise DevOps Kubernetes clusters, pipelines, GitOps & HPA...");

    await clusterRepository.save({
      clusterId: "cls_prod_us_east_1",
      name: "eks-prod-us-east-1",
      region: "us-east-1",
      provider: "EKS",
      kubernetesVersion: "v1.30.2",
      nodeCount: 6,
      status: ClusterStatusEnum.HEALTHY,
      cpuUsagePercent: 28.4,
      memoryUsagePercent: 44.2,
    });

    await deploymentRepository.save({
      deploymentId: "dep_api_gateway",
      name: "api-gateway",
      namespace: "production",
      clusterId: "cls_prod_us_east_1",
      imageTag: "v1.4.0",
      replicas: 3,
      availableReplicas: 3,
      strategy: "CANARY",
      status: DeploymentStatusEnum.RUNNING,
    });

    await pipelineRepository.savePipeline({
      pipelineId: "pip_main_build",
      name: "Main Platform Release Pipeline",
      repositoryUrl: "github.com/enterprise/x402-platform",
      branch: "main",
      lastRunStatus: PipelineStatusEnum.SUCCESS,
      totalBuildsCount: 142,
    });

    await pipelineRepository.saveSignature({
      signatureId: "sig_release_v1_4_0",
      imageRef: "ghcr.io/enterprise/x402-platform:v1.4.0",
      signerIdentity: "cosign-keyless@enterprise.iam",
      algorithm: "ECDSA_P256_SHA256",
      isVerified: true,
      signedAt: new Date(),
    });

    await pipelineRepository.saveSbom({
      sbomId: "sbom_v1_4_0",
      imageRef: "ghcr.io/enterprise/x402-platform:v1.4.0",
      componentsCount: 142,
      vulnerabilitiesFoundCount: 0,
      format: "SPDX",
    });

    await gitOpsRepository.save({
      appId: "app_platform_core",
      appName: "x402-platform-production",
      repoUrl: "github.com/enterprise/x402-gitops",
      path: "k8s/overlays/production",
      targetRevision: "HEAD",
      syncStatus: "SYNCHRONIZED",
      healthStatus: "HEALTHY",
    });

    await autoscalingRepository.save({
      policyId: "hpa_api_gateway",
      deploymentName: "api-gateway",
      minReplicas: 3,
      maxReplicas: 12,
      targetCpuPercent: 80,
      targetMemoryPercent: 85,
      currentReplicas: 3,
      enabled: true,
    });

    await backupRepository.save({
      backupId: "bkp_daily_snapshot",
      name: "Daily Cluster Volume Snapshot",
      targetCluster: "eks-prod-us-east-1",
      snapshotSizeGb: 45,
      status: "COMPLETED",
    });

    logger.info("✅ Enterprise DevOps seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ DevOps seeder warning: ${err.message}`);
  }
}
