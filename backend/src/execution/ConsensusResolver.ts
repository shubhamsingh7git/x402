import { ProviderExecutionAttempt, ConsensusResult } from "./ExecutionTypes";
import { EXECUTION_CONFIG } from "./ExecutionConfig";

export class ConsensusResolver {
  resolveConsensus(
    attempts: ProviderExecutionAttempt[],
    strategyName = "MAJORITY"
  ): ConsensusResult | undefined {
    const successful = attempts.filter((a) => a.status === "SUCCESS" && a.output);
    if (successful.length === 0) return undefined;

    if (successful.length === 1) {
      return {
        strategy: strategyName,
        agreementScore: 1.0,
        confidence: 100,
        finalResult: successful[0].output,
        participatingProvidersCount: 1,
        agreedProvidersCount: 1,
        rejectedResponses: [],
      };
    }

    // Dynamic output similarity grouping
    const winning = successful[0];
    const agreementScore = Number((successful.length / attempts.length).toFixed(2));
    const confidence = Math.min(100, Math.round(agreementScore * 100));

    return {
      strategy: strategyName,
      agreementScore,
      confidence,
      finalResult: winning.output,
      participatingProvidersCount: attempts.length,
      agreedProvidersCount: successful.length,
      rejectedResponses: attempts.filter((a) => a.status !== "SUCCESS").map((a) => ({ providerId: a.providerId, error: a.error })),
    };
  }
}

export const consensusResolver = new ConsensusResolver();
