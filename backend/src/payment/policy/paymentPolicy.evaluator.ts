import { policyRepository } from "../../repositories/policy.repository";
import { transactionRepository } from "../../repositories/transaction.repository";
import { PaymentContext } from "../dto/paymentContext";
import { PaymentLifecycleLogger } from "../logger/paymentLifecycle.logger";

export interface PolicyDecision {
  approved: boolean;
  reason: string;
  policySnapshot?: {
    transactionLimit: number;
    dailyBudget: number;
    maxTxPerMinute: number;
    killSwitch: boolean;
  };
}

export class PaymentPolicyEvaluator {
  async evaluate(context: PaymentContext): Promise<PolicyDecision> {
    // 1. Resolve Policy for verified merchant
    const policy = await policyRepository.findByMerchantId(context.merchantId);
    if (!policy) {
      const decision = { approved: false, reason: `No active spend policy found for merchant [${context.merchantId}]` };
      PaymentLifecycleLogger.logPolicyDecision(context, decision);
      return decision;
    }

    // 2. Kill Switch & Enabled check
    if (policy.killSwitch || !policy.enabled) {
      const decision = { approved: false, reason: `Policy Kill-Switch active or policy disabled for merchant [${context.merchantId}]` };
      PaymentLifecycleLogger.logPolicyDecision(context, decision);
      return decision;
    }

    const snapshot = {
      transactionLimit: policy.transactionLimit,
      dailyBudget: policy.dailyBudget,
      maxTxPerMinute: policy.maxTransactionsPerMinute,
      killSwitch: policy.killSwitch,
    };

    // 3. Per-transaction limit cap
    if (context.amount > policy.transactionLimit) {
      const decision = {
        approved: false,
        reason: `Transaction amount ($${context.amount}) exceeds max single transaction limit ($${policy.transactionLimit})`,
        policySnapshot: snapshot,
      };
      PaymentLifecycleLogger.logPolicyDecision(context, decision);
      return decision;
    }

    // 4. Daily budget ceiling
    const todaySpend = await transactionRepository.sumAmountToday(context.merchantId);
    if (todaySpend + context.amount > policy.dailyBudget) {
      const decision = {
        approved: false,
        reason: `Cumulative spend ($${(todaySpend + context.amount).toFixed(2)}) exceeds daily budget cap ($${policy.dailyBudget})`,
        policySnapshot: snapshot,
      };
      PaymentLifecycleLogger.logPolicyDecision(context, decision);
      return decision;
    }

    // 5. Success - Spend policy compliant
    const decision = {
      approved: true,
      reason: `Transaction of $${context.amount} compliant with spend policy for merchant [${context.merchantId}]`,
      policySnapshot: snapshot,
    };
    PaymentLifecycleLogger.logPolicyDecision(context, decision);
    return decision;
  }
}

export const paymentPolicyEvaluator = new PaymentPolicyEvaluator();
