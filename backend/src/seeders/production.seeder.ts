import { availabilityRepository } from "../repositories/AvailabilityRepository";
import { performanceRepository } from "../repositories/PerformanceRepository";
import { recoveryRepository } from "../repositories/RecoveryRepository";
import { chaosRepository } from "../repositories/ChaosRepository";
import { releaseRepository } from "../repositories/ReleaseRepository";
import { RegionalAvailabilityStatusEnum, ChaosStatusEnum } from "../production/ProductionStatus";
import { logger } from "../utils/logger";

export async function seedProductionData(): Promise<void> {
  try {
    const count = await availabilityRepository.countRegions();
    if (count > 0) return;

    logger.info("🌱 Seeding Enterprise Production HA regions, performance reports, DR validations, chaos experiments, releases & runbooks...");

    await availabilityRepository.saveRegion({
      regionId: "reg_us_east_1",
      name: "US East (N. Virginia)",
      code: "us-east-1",
      isPrimary: true,
      status: RegionalAvailabilityStatusEnum.ACTIVE,
      latencyMs: 12,
    });

    await availabilityRepository.saveRegion({
      regionId: "reg_us_west_2",
      name: "US West (Oregon)",
      code: "us-west-2",
      isPrimary: false,
      status: RegionalAvailabilityStatusEnum.ACTIVE,
      latencyMs: 38,
    });

    await availabilityRepository.savePolicy({
      policyId: "pol_multi_region_active_active",
      name: "Global Multi-Region Active-Active Routing Policy",
      primaryRegion: "us-east-1",
      secondaryRegion: "us-west-2",
      mode: "ACTIVE_ACTIVE",
      autoFailoverEnabled: true,
    });

    await performanceRepository.saveReport({
      reportId: "rep_baseline_production",
      p50LatencyMs: 14,
      p95LatencyMs: 45,
      p99LatencyMs: 110,
      requestsPerSecond: 4200,
      cacheHitRatioPercent: 94.8,
      bottlenecksFound: [],
    });

    await recoveryRepository.saveValidation({
      validationId: "rec_q3_dr_validation",
      rpoActualSeconds: 180,
      rtoActualSeconds: 420,
      backupIntegrityVerified: true,
      status: "PASSED",
      testedAt: new Date(),
    });

    await chaosRepository.save({
      experimentId: "ch_svc_latency_injection",
      title: "API Gateway Latency Spike Resilience Test",
      faultType: "LATENCY_INJECTION",
      targetService: "api-gateway",
      resilienceScorePercent: 98.5,
      status: ChaosStatusEnum.PASSED,
      lastExecutedAt: new Date(),
    });

    await releaseRepository.saveRelease({
      releaseId: "rel_v2_0_0_gold",
      version: "v2.0.0",
      title: "Enterprise AI Operating System Gold Release",
      status: "APPROVED",
      approvedBy: "release-governance-board@enterprise.iam",
      scheduledAt: new Date(),
    });

    await releaseRepository.saveRunbook({
      runbookId: "rb_db_failover",
      title: "MongoDB Cluster Primary Failover Procedures",
      service: "database-cluster",
      ownerTeam: "SRE Platform Team",
      stepsCount: 6,
      lastUpdated: new Date(),
    });

    logger.info("✅ Enterprise Production seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Production seeder warning: ${err.message}`);
  }
}
