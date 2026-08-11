import { policyInformationPoint } from "./PolicyInformationPoint";
import { policyDecisionPoint } from "./PolicyDecisionPoint";
import { PolicyEffectEnum } from "./SecurityStatus";
import { logger } from "../utils/logger";

export class PolicyEnforcementPoint {
  async enforce(userId: string, resource: string, action: string): Promise<boolean> {
    const context = await policyInformationPoint.resolveSubjectContext(userId);
    const { decision, reason } = await policyDecisionPoint.evaluateAccess(context, resource, action);

    logger.debug(`🛡️ PEP Enforcement on '${resource}:${action}' Decision: ${decision} (${reason})`);
    return decision === PolicyEffectEnum.PERMIT;
  }
}

export const policyEnforcementPoint = new PolicyEnforcementPoint();
