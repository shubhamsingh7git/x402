import { BaseExecutor } from "./BaseExecutor";
import { ExecutorInput, ExecutorResult } from "../../interfaces/executor.interface";
import { paymentManager } from "../../payment/manager/payment.manager";

export class FinancialExecutor extends BaseExecutor {
  readonly type = "FINANCIAL_DATA";

  supports(type: string): boolean {
    const t = type.toUpperCase();
    return t === "FINANCIAL_DATA" || t === "DATA" || t === "FINANCIAL";
  }

  async execute(input: ExecutorInput, _memory: Record<string, unknown>): Promise<ExecutorResult> {
    const company = (input.input.company as string) || (input.input.query as string) || "Target Entity";

    // 1. Process micro-payment via PaymentManager
    const paymentResult = await paymentManager.processPayment({
      serviceId: "svc_financial",
      merchantId: "Weather API",
      price: 0.02,
      runId: input.runId,
      stepId: input.stepId,
      metadata: { company },
    });

    if (!paymentResult.success) {
      return this.createResult(
        false,
        null,
        0,
        { paymentStatus: paymentResult.status, error: paymentResult.error },
        [],
        paymentResult.error || "Payment denied by Policy Guard"
      );
    }

    // 2. Returns realistic financial metrics (to be replaced by x402 Financial API in M4)
    const mockFinancialResults = {
      entity: company,
      currency: "USD",
      marketCap: "$820.5B",
      quarterlyRevenue: "$25.17B",
      revenueGrowthYoY: "+12.4%",
      grossMargin: "18.2%",
      treasuryAllocation: {
        aiRndSpend: "$3.4B",
        computeInfrastructure: "$1.8B",
        cashReserve: "$17.2B",
      },
      fiduciaryMetrics: {
        debtToEquity: 0.14,
        operatingCashFlow: "$3.8B",
        burnRateMonthly: "$420M",
      },
    };

    const artifacts = [
      { type: "FINANCIAL_METRICS_JSON", uri: `memory://financial_${input.runId}.json` },
    ];

    return this.createResult(
      true,
      mockFinancialResults,
      paymentResult.amount,
      { executor: "FinancialExecutor", paymentId: paymentResult.paymentId, txHash: paymentResult.transactionId },
      artifacts
    );
  }
}

export const financialExecutor = new FinancialExecutor();
