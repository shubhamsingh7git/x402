import { RegionalAvailabilityStatusEnum, ReadinessGradeEnum, ChaosStatusEnum } from "./ProductionStatus";

export interface IRegionDTO {
  id?: string;
  regionId: string;
  name: string;
  code: string;
  isPrimary: boolean;
  status: RegionalAvailabilityStatusEnum;
  latencyMs: number;
  createdAt?: string | Date;
}

export interface IPerformanceReportDTO {
  id?: string;
  reportId: string;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  requestsPerSecond: number;
  cacheHitRatioPercent: number;
  bottlenecksFound: string[];
  createdAt?: string | Date;
}

export interface IDisasterRecoveryValidationDTO {
  id?: string;
  validationId: string;
  rpoActualSeconds: number;
  rtoActualSeconds: number;
  backupIntegrityVerified: boolean;
  status: "PASSED" | "FAILED" | string;
  testedAt?: string | Date;
}

export interface IChaosExperimentDTO {
  id?: string;
  experimentId: string;
  title: string;
  faultType: "SERVICE_OUTAGE" | "LATENCY_INJECTION" | "DB_PARTITION" | string;
  targetService: string;
  resilienceScorePercent: number;
  status: ChaosStatusEnum;
  lastExecutedAt?: string | Date;
}

export interface IReleaseDTO {
  id?: string;
  releaseId: string;
  version: string;
  title: string;
  status: "APPROVED" | "PENDING" | "FROZEN" | "REJECTED" | string;
  approvedBy?: string;
  scheduledAt?: string | Date;
  createdAt?: string | Date;
}

export interface IOperationalRunbookDTO {
  id?: string;
  runbookId: string;
  title: string;
  service: string;
  ownerTeam: string;
  stepsCount: number;
  lastUpdated?: string | Date;
}

export interface IProductionCertificationDTO {
  readinessScorePercent: number;
  grade: ReadinessGradeEnum;
  isHaVerified: boolean;
  isDrVerified: boolean;
  isChaosVerified: boolean;
  certifiedAt: string | Date;
}

export interface IProductionAnalyticsDTO {
  readinessScorePercent: number;
  grade: string;
  activeRegionsCount: number;
  haStatus: string;
  drStatus: string;
  chaosResilienceScorePercent: number;
  pendingReleasesCount: number;
  operationalRunbooksCount: number;
}
