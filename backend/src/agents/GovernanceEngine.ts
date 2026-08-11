import { IGovernanceEvaluationDTO } from "./AgentTypes";
import { AGENT_CONFIG } from "./AgentConfig";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class GovernanceEngine {
  evaluateTaskGovernance(capability: string, estimatedCostUsd = 0.02): IGovernanceEvaluationDTO {
    const policyViolations: string[] = [];

    // Risk scoring based on capability sensitivity
    let riskScore = 20;
    if (capability.includes("payment") || capability.includes("transfer") || capability.includes("override")) {
      riskScore = 85;
    } else if (capability.includes("financial") || capability.includes("delete")) {
      riskScore = 55;
    }

    const requiresApproval = riskScore >= AGENT_CONFIG.governanceRiskThresholds.HIGH_RISK_REQUIRE_APPROVAL;
    const allowed = riskScore < 95;

    if (requiresApproval) {
      policyViolations.push(`High risk score (${riskScore}/100) requires human approval gate`);
    }

    const result: IGovernanceEvaluationDTO = {
      allowed,
      requiresApproval,
      riskScore,
      policyViolations,
      maxAllowedSpendUsd: 10.0,
    };

    logger.info(`🛡️ GovernanceEngine evaluated capability '${capability}' → Risk: ${riskScore}, RequireApproval: ${requiresApproval}`);
    eventBus.emitEvent("governance:evaluated" as any, result as any);

    return result;
  }
}

export const governanceEngine = new GovernanceEngine();
