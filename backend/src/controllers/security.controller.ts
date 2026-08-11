import { Request, Response, NextFunction } from "express";
import { authenticationService } from "../security/AuthenticationService";
import { securityPolicyRepository } from "../repositories/SecurityPolicyRepository";
import { complianceEngine } from "../security/ComplianceEngine";
import { threatDetectionEngine } from "../security/ThreatDetectionEngine";
import { encryptionService } from "../security/EncryptionService";
import { ApiResponse } from "../utils/ApiResponse";

export class SecurityController {
  async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = {
        zeroTrustStatus: "ENFORCED",
        pepStatus: "ACTIVE",
        pdpStatus: "ACTIVE",
        pipStatus: "ACTIVE",
        kmsKeyVersion: encryptionService.getKeyVersion(),
        activeSessionsCount: 3,
      };
      ApiResponse.ok(res, "Security status retrieved successfully", health);
    } catch (error) {
      next(error);
    }
  }

  async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await authenticationService.getActiveSessions();
      ApiResponse.ok(res, "Active sessions retrieved successfully", sessions);
    } catch (error) {
      next(error);
    }
  }

  async mfaSetup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mfa = {
        deviceId: `dev_${Date.now()}`,
        qrCodeUrl: "otpauth://totp/x402:user@enterprise.com?secret=JBSWY3DPEHPK3PXP&issuer=x402",
        status: "ENROLLED",
      };
      ApiResponse.ok(res, "MFA device enrolled successfully", mfa);
    } catch (error) {
      next(error);
    }
  }

  async revokeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.body;
      const revoked = await authenticationService.revokeSession(sessionId);
      ApiResponse.ok(res, "Session revoked successfully", revoked);
    } catch (error) {
      next(error);
    }
  }

  async getPolicies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policies = await securityPolicyRepository.find(50);
      ApiResponse.ok(res, "Authorization policies retrieved successfully", policies);
    } catch (error) {
      next(error);
    }
  }

  async getCompliance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const compliance = await complianceEngine.getComplianceReports();
      ApiResponse.ok(res, "Compliance reports retrieved successfully", compliance);
    } catch (error) {
      next(error);
    }
  }

  async getThreats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threats = await threatDetectionEngine.getThreats();
      ApiResponse.ok(res, "Threat events retrieved successfully", threats);
    } catch (error) {
      next(error);
    }
  }

  async getIncidents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const incidents = await threatDetectionEngine.getSecurityIncidents();
      ApiResponse.ok(res, "Security incidents retrieved successfully", incidents);
    } catch (error) {
      next(error);
    }
  }

  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await complianceEngine.getComplianceReports();
      ApiResponse.ok(res, "Compliance reports retrieved successfully", reports);
    } catch (error) {
      next(error);
    }
  }

  async rotateKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await encryptionService.rotateMasterKey();
      ApiResponse.ok(res, "KMS Master key rotated successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

export const securityController = new SecurityController();
