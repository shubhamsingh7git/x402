import { identityRepository } from "../repositories/IdentityRepository";
import { sessionRepository } from "../repositories/SessionRepository";
import { securityPolicyRepository } from "../repositories/SecurityPolicyRepository";
import { complianceEngine } from "../security/ComplianceEngine";
import { threatDetectionEngine } from "../security/ThreatDetectionEngine";
import { PolicyEffectEnum, SessionStatusEnum } from "../security/SecurityStatus";
import { logger } from "../utils/logger";

export async function seedSecurityData(): Promise<void> {
  try {
    const count = await identityRepository.count();
    if (count > 0) return;

    logger.info("🌱 Seeding Enterprise Security Zero Trust identities, sessions, policies & compliance...");

    await identityRepository.create({
      userId: "usr_admin_001",
      email: "admin@enterprise.com",
      role: "PLATFORM_ADMIN",
      isMfaEnabled: true,
      riskScore: 5,
    });

    await sessionRepository.create({
      sessionId: `ses_${Date.now()}_01`,
      userId: "usr_admin_001",
      ipAddress: "192.168.1.10",
      userAgent: "Mozilla/5.0 Enterprise Workstation",
      status: SessionStatusEnum.ACTIVE,
      isMfaVerified: true,
      expiresAt: new Date(Date.now() + 86400000),
    });

    await securityPolicyRepository.save({
      policyId: "pol_admin_full_access",
      policyName: "Platform Admin Full Access Policy",
      subjectRole: "PLATFORM_ADMIN",
      resource: "*",
      action: "*",
      effect: PolicyEffectEnum.PERMIT,
    });

    await complianceEngine.runAudit("SOC2");
    await complianceEngine.runAudit("GDPR");
    await complianceEngine.runAudit("ISO27001");

    await threatDetectionEngine.recordThreat("SUSPICIOUS_LOGIN", "203.0.113.195", "Multiple failed login attempts detected", "MEDIUM");

    logger.info("✅ Enterprise Security seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Security seeder warning: ${err.message}`);
  }
}
