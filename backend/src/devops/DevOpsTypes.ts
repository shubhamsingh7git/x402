import { ClusterStatusEnum, DeploymentStatusEnum, PipelineStatusEnum } from "./ClusterStatus";

export interface IClusterDTO {
  id?: string;
  clusterId: string;
  name: string;
  region: string;
  provider: "EKS" | "GKE" | "AKS" | "K3S" | string;
  kubernetesVersion: string;
  nodeCount: number;
  status: ClusterStatusEnum;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  createdAt?: string | Date;
}

export interface IDeploymentDTO {
  id?: string;
  deploymentId: string;
  name: string;
  namespace: string;
  clusterId: string;
  imageTag: string;
  replicas: number;
  availableReplicas: number;
  strategy: "CANARY" | "BLUE_GREEN" | "ROLLING_UPDATE" | string;
  status: DeploymentStatusEnum;
  createdAt?: string | Date;
}

export interface IPipelineDTO {
  id?: string;
  pipelineId: string;
  name: string;
  repositoryUrl: string;
  branch: string;
  lastRunStatus: PipelineStatusEnum;
  totalBuildsCount: number;
  createdAt?: string | Date;
}

export interface ISbomDTO {
  id?: string;
  sbomId: string;
  imageRef: string;
  componentsCount: number;
  vulnerabilitiesFoundCount: number;
  format: "SPDX" | "CYCLONEDX" | string;
  createdAt?: string | Date;
}

export interface IArtifactSignatureDTO {
  id?: string;
  signatureId: string;
  imageRef: string;
  signerIdentity: string;
  algorithm: string;
  isVerified: boolean;
  signedAt?: string | Date;
}

export interface IGitOpsApplicationDTO {
  id?: string;
  appId: string;
  appName: string;
  repoUrl: string;
  path: string;
  targetRevision: string;
  syncStatus: "SYNCHRONIZED" | "OUT_OF_SYNC" | "SYNCING" | string;
  healthStatus: "HEALTHY" | "PROGRESSING" | "DEGRADED" | string;
  createdAt?: string | Date;
}

export interface IAutoscalingPolicyDTO {
  id?: string;
  policyId: string;
  deploymentName: string;
  minReplicas: number;
  maxReplicas: number;
  targetCpuPercent: number;
  targetMemoryPercent: number;
  currentReplicas: number;
  enabled: boolean;
  createdAt?: string | Date;
}

export interface IBackupPolicyDTO {
  id?: string;
  backupId: string;
  name: string;
  targetCluster: string;
  snapshotSizeGb: number;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED" | string;
  createdAt?: string | Date;
}

export interface IDevOpsAnalyticsDTO {
  clustersCount: number;
  healthyClustersCount: number;
  deploymentsCount: number;
  activePodsCount: number;
  runningPipelinesCount: number;
  gitOpsAppsCount: number;
  hpaPoliciesCount: number;
  signedImagesCount: number;
  sbomsGeneratedCount: number;
  completedBackupsCount: number;
}
