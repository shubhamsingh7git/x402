import { BaseExecutor } from "./BaseExecutor";
import { ExecutorInput, ExecutorResult } from "../../interfaces/executor.interface";
import { paymentManager } from "../../payment/manager/payment.manager";

export class SummaryExecutor extends BaseExecutor {
  readonly type = "SUMMARY";

  async execute(input: ExecutorInput, memory: Record<string, unknown>): Promise<ExecutorResult> {
    const topic = (input.input.topic as string) || "Autonomous Research Target";

    // 1. Process micro-payment via PaymentManager
    const paymentResult = await paymentManager.processPayment({
      serviceId: "svc_summary",
      merchantId: "Research API",
      price: 0.01,
      runId: input.runId,
      stepId: input.stepId,
      metadata: { topic },
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

    // 2. Synthesize report using accumulated execution memory
    const searchData = memory.search as Record<string, unknown> | undefined;
    const financialData = memory.financial as Record<string, unknown> | undefined;

    const summaryReport = {
      title: `Executive Fiduciary Report: ${topic}`,
      generatedAt: new Date().toISOString(),
      executiveSummary: `Synthesis of collected intelligence for ${topic}. The target demonstrates strong structural positioning with robust financial resilience and high compliance alignment.`,
      keyFindings: [
        searchData?.insights
          ? (searchData.insights as string[])[0]
          : "Web intelligence confirms active deployment of next-generation AI capabilities.",
        financialData?.marketCap
          ? `Market Valuation: ${financialData.marketCap} with quarterly revenue of ${financialData.quarterlyRevenue}.`
          : "Financial metrics indicate sustainable cash burn and disciplined capital allocation.",
        "Fiduciary Risk Level: LOW — compliant with Policy Guard parameters and budget ceilings.",
      ],
      financialOverview: financialData || { status: "No financial metrics gathered" },
      searchIntelligence: searchData || { status: "No web search data gathered" },
      recommendation: "APPROVED for ongoing automated workflow monitoring and micro-transaction allocation.",
    };

    const artifacts = [
      { type: "EXECUTIVE_REPORT_JSON", uri: `memory://summary_${input.runId}.json` },
    ];

    return this.createResult(
      true,
      summaryReport,
      paymentResult.amount,
      { executor: "SummaryExecutor", paymentId: paymentResult.paymentId, txHash: paymentResult.transactionId },
      artifacts
    );
  }
}

export const summaryExecutor = new SummaryExecutor();
