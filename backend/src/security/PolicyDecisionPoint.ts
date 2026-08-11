import { ISubjectContext } from "./PolicyInformationPoint";
import { securityPolicyRepository } from "../repositories/SecurityPolicyRepository";
import { PolicyEffectEnum } from "./SecurityStatus";
import { logger } from "../utils/logger";

export class PolicyDecisionPoint {
  async evaluateAccess(context: ISubjectContext, resource: string, action: string): Promise<{ decision: PolicyEffectEnum; reason: string }> {
    if (context.riskScore > 80) {
      logger.warn(`⛔ PDP DENY for User [${context.userId}] high risk score (${context.riskScore})`);
      return { decision: PolicyEffectEnum.DENY, reason: "High risk score exceeds threshold" };
    }

    const policies = await securityPolicyRepository.find(100);
    const matchingPolicy = policies.find(
      (p) => p.subjectRole === context.role && p.resource === resource && p.action === action
    );

    if (matchingPolicy) {
      logger.debug(`✅ PDP evaluated PERMIT via Policy '${matchingPolicy.policyName}'`);
      return { decision: matchingPolicy.effect, reason: `Matches policy ${matchingPolicy.policyId}` };
    }

    return { decision: PolicyEffectEnum.PERMIT, reason: "Default implicit permit" };
  }
}

export const policyDecisionPoint = new PolicyDecisionPoint();
