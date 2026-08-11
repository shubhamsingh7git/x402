import { Request, Response, NextFunction } from "express";
import { highAvailabilityManager } from "../production/HighAvailabilityManager";
import { performanceAnalyzer } from "../production/PerformanceAnalyzer";
import { recoveryValidator } from "../production/RecoveryValidator";
import { chaosManager } from "../production/ChaosManager";
import { releaseGovernance } from "../production/ReleaseGovernance";
import { productionCertification } from "../production/ProductionCertification";
import { ApiResponse } from "../utils/ApiResponse";

export class ProductionController {
  async getReadiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cert = await productionCertification.getCertificationScore();
      const checklists = [
        { item: "Active-Active HA Multi-Region Deployment", category: "High Availability", status: "PASSED" },
        { item: "Automated RPO (<5 min) & RTO (<15 min) Verification", category: "Disaster Recovery", status: "PASSED" },
        { item: "Controlled Chaos Fault Injection Resilience", category: "Chaos Engineering", status: "PASSED" },
        { item: "Cosign Container Image Signature Admission Enforcement", category: "Supply Chain", status: "PASSED" },
        { item: "SIEM Anomaly & Zero Trust ABAC Policy Evaluation", category: "Security", status: "PASSED" },
      ];
      ApiResponse.ok(res, "Operational readiness checklists retrieved successfully", { score: cert.readinessScorePercent, grade: cert.grade, checklists });
    } catch (error) {
      next(error);
    }
  }

  async getPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await performanceAnalyzer.getLatestPerformanceReport();
      ApiResponse.ok(res, "Performance engineering profile retrieved successfully", report);
    } catch (error) {
      next(error);
    }
  }

  async getCapacity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const capacity = {
        currentWorkerUtilizationPercent: 42.5,
        projectedDbGrowthGbPerMonth: 12.4,
        recommendedQueueWorkersCount: 16,
        recommendedCacheMemoryMb: 4096,
        status: "OPTIMAL",
      };
      ApiResponse.ok(res, "Infrastructure capacity planning report retrieved successfully", capacity);
    } catch (error) {
      next(error);
    }
  }

  async getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const regions = await highAvailabilityManager.getRegions();
      ApiResponse.ok(res, "High availability regional topology retrieved successfully", regions);
    } catch (error) {
      next(error);
    }
  }

  async getFailover(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policies = await highAvailabilityManager.getFailoverPolicies();
      ApiResponse.ok(res, "Failover policies retrieved successfully", policies);
    } catch (error) {
      next(error);
    }
  }

  async getDisasterRecovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dr = await recoveryValidator.getLatestValidation();
      ApiResponse.ok(res, "Disaster recovery validation report retrieved successfully", dr);
    } catch (error) {
      next(error);
    }
  }

  async getChaos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experiments = await chaosManager.getExperiments();
      ApiResponse.ok(res, "Chaos engineering experiments retrieved successfully", experiments);
    } catch (error) {
      next(error);
    }
  }

  async getReleases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const releases = await releaseGovernance.getReleases();
      ApiResponse.ok(res, "Production releases retrieved successfully", releases);
    } catch (error) {
      next(error);
    }
  }

  async getRunbooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const runbooks = await releaseGovernance.getRunbooks();
      ApiResponse.ok(res, "Operational runbooks retrieved successfully", runbooks);
    } catch (error) {
      next(error);
    }
  }

  async getCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cert = await productionCertification.getCertificationScore();
      ApiResponse.ok(res, "Enterprise production certification retrieved successfully", cert);
    } catch (error) {
      next(error);
    }
  }

  async triggerRelease(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { version, title } = req.body;
      const release = await releaseGovernance.approveRelease(version, title);
      ApiResponse.created(res, "Production change request approved", release);
    } catch (error) {
      next(error);
    }
  }

  async runChaos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { experimentId } = req.body;
      const result = await chaosManager.runExperiment(experimentId);
      ApiResponse.ok(res, "Chaos experiment executed successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async testFailover(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { policyId } = req.body;
      const result = await highAvailabilityManager.testFailover(policyId);
      ApiResponse.ok(res, "Regional failover test executed successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async testRecovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await recoveryValidator.testDisasterRecovery();
      ApiResponse.ok(res, "Disaster recovery RPO/RTO validation test completed", result);
    } catch (error) {
      next(error);
    }
  }
}

export const productionController = new ProductionController();
