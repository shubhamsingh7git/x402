import { identityRepository } from "../repositories/IdentityRepository";
import { sessionRepository } from "../repositories/SessionRepository";
import { logger } from "../utils/logger";

export interface ISubjectContext {
  userId: string;
  role: string;
  ipAddress: string;
  isMfaVerified: boolean;
  riskScore: number;
}

export class PolicyInformationPoint {
  async resolveSubjectContext(userId: string, sessionId?: string): Promise<ISubjectContext> {
    const identity = await identityRepository.findByUserId(userId);
    const role = identity?.role || "USER";
    const riskScore = identity?.riskScore || 0;

    logger.debug(`ℹ️ PIP resolved context for User [${userId}] Role: ${role} RiskScore: ${riskScore}`);
    return {
      userId,
      role,
      ipAddress: "127.0.0.1",
      isMfaVerified: true,
      riskScore,
    };
  }
}

export const policyInformationPoint = new PolicyInformationPoint();
