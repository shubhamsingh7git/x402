import { IBazaarRankedCandidate } from "../bazaar/BazaarTypes";
import { SelectionExplanation } from "./PlannerTypes";
import { PLANNER_CONFIG, IPlannerWeights } from "./PlannerConfig";

export interface IProviderSelectionStrategy {
  strategyName: string;
  selectBestProvider(
    capability: string,
    candidates: IBazaarRankedCandidate[],
    customWeights?: Partial<IPlannerWeights>
  ): { selected: IBazaarRankedCandidate; explanation: SelectionExplanation } | null;
}

export class DefaultBalancedSelectionStrategy implements IProviderSelectionStrategy {
  strategyName = "DEFAULT_BALANCED";

  selectBestProvider(
    capability: string,
    candidates: IBazaarRankedCandidate[],
    customWeights?: Partial<IPlannerWeights>
  ): { selected: IBazaarRankedCandidate; explanation: SelectionExplanation } | null {
    if (!candidates || candidates.length === 0) return null;

    const weights = { ...PLANNER_CONFIG.weights, ...customWeights };

    // Score and rank candidate providers
    const scoredCandidates = candidates.map((cand) => {
      const capMatch = cand.listing.capabilities.includes(capability.toLowerCase()) ? 100 : 70;
      const verScore = cand.metrics.verificationScore;
      const trustScore = cand.metrics.trustScore;
      const latScore = Math.max(0, 100 - cand.metrics.latencyMs / 10);
      const priceScore = Math.max(0, 100 - cand.listing.pricePerCall * 1000);

      const plannerScore = Number(
        (
          capMatch * weights.capabilityMatch +
          verScore * weights.merchantVerification +
          trustScore * weights.trustScore +
          latScore * weights.latencySla +
          priceScore * weights.priceCompetitiveness
        ).toFixed(2)
      );

      return {
        cand,
        scores: {
          capMatch,
          verScore,
          trustScore,
          latScore,
          priceScore,
          plannerScore,
        },
      };
    });

    // Sort by weighted planner score descending
    scoredCandidates.sort((a, b) => b.scores.plannerScore - a.scores.plannerScore);

    const winner = scoredCandidates[0];
    const merchant = winner.cand.merchant;
    const listing = winner.cand.listing;

    const explanation: SelectionExplanation = {
      selectedProviderId: listing.providerId,
      merchantAlias: merchant.alias || "Unknown Merchant",
      capability,
      plannerScore: winner.scores.plannerScore,
      selectionReason: `Selected ${merchant.alias} (${listing.providerId}) with highest balanced composite score of ${winner.scores.plannerScore}/100. Merchant status: ${merchant.status}, Trust score: ${winner.scores.trustScore}%, Latency: ${winner.cand.metrics.latencyMs}ms.`,
      rankingBreakdown: {
        capabilityMatchScore: winner.scores.capMatch,
        verificationScore: winner.scores.verScore,
        trustScore: winner.scores.trustScore,
        latencyScore: winner.scores.latScore,
        priceScore: winner.scores.priceScore,
        compositeScore: winner.scores.plannerScore,
      },
      rejectedProvidersCount: candidates.length - 1,
      estimatedCost: listing.pricePerCall || 0.02,
      estimatedLatencyMs: winner.cand.metrics.latencyMs || 120,
    };

    return {
      selected: winner.cand,
      explanation,
    };
  }
}

// Prepared Extension Points for Future Milestones
export class LowestCostSelectionStrategy implements IProviderSelectionStrategy {
  strategyName = "LOWEST_COST";
  selectBestProvider(capability: string, candidates: IBazaarRankedCandidate[]): any {
    const balanced = new DefaultBalancedSelectionStrategy();
    return balanced.selectBestProvider(capability, candidates, { priceCompetitiveness: 0.60 });
  }
}

export class LowestLatencySelectionStrategy implements IProviderSelectionStrategy {
  strategyName = "LOWEST_LATENCY";
  selectBestProvider(capability: string, candidates: IBazaarRankedCandidate[]): any {
    const balanced = new DefaultBalancedSelectionStrategy();
    return balanced.selectBestProvider(capability, candidates, { latencySla: 0.60 });
  }
}
