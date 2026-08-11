import { BaseExecutor } from "./BaseExecutor";
import { ExecutorInput, ExecutorResult } from "../../interfaces/executor.interface";
import { paymentManager } from "../../payment/manager/payment.manager";

export class SearchExecutor extends BaseExecutor {
  readonly type = "SEARCH";

  async execute(input: ExecutorInput, _memory: Record<string, unknown>): Promise<ExecutorResult> {
    const query = (input.input.query as string) || "General Research Target";

    // 1. Process micro-payment via PaymentManager
    const paymentResult = await paymentManager.processPayment({
      serviceId: "svc_search",
      merchantId: "OpenAI API",
      price: 0.01,
      runId: input.runId,
      stepId: input.stepId,
      metadata: { query },
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

    // 2. Returns realistic search data (to be replaced by x402 Search API in M4)
    const mockSearchResults = {
      query,
      sourcesCount: 14,
      topResults: [
        {
          title: `${query} — Strategic Overview & Market Position`,
          url: `https://intelligence.research.org/v1/${encodeURIComponent(query)}`,
          snippet: `Key developments, deployment updates, and ecosystem expansion for ${query}.`,
          relevanceScore: 0.96,
        },
        {
          title: `Autonomous Micro-Transactions & Fiduciary Benchmarks`,
          url: `https://fiduciary.compliance.gov/rubrics`,
          snippet: `Compliance metrics and risk factors associated with automated LLM reasoning loops.`,
          relevanceScore: 0.89,
        },
      ],
      insights: [
        "Strong market acceleration in enterprise AI integration.",
        "Compliance alignment with DPDP and international data privacy frameworks.",
        "Increased focus on verifiable micro-transaction budget caps.",
      ],
    };

    const artifacts = [
      { type: "SEARCH_RESULTS_JSON", uri: `memory://search_${input.runId}.json` },
    ];

    return this.createResult(
      true,
      mockSearchResults,
      paymentResult.amount,
      { executor: "SearchExecutor", paymentId: paymentResult.paymentId, txHash: paymentResult.transactionId },
      artifacts
    );
  }
}

export const searchExecutor = new SearchExecutor();
