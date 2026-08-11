import { IBazaarRankedCandidate } from "../bazaar/BazaarTypes";
import { ExecutionProviderStep, PlannerCapability } from "./PlannerTypes";
import { IProviderSelectionStrategy, DefaultBalancedSelectionStrategy } from "./ProviderSelectionStrategy";

export class ProviderSelection {
  private strategy: IProviderSelectionStrategy;

  constructor(strategy?: IProviderSelectionStrategy) {
    this.strategy = strategy || new DefaultBalancedSelectionStrategy();
  }

  setStrategy(strategy: IProviderSelectionStrategy): void {
    this.strategy = strategy;
  }

  selectForCapabilities(
    capabilities: PlannerCapability[],
    candidateMap: Map<string, IBazaarRankedCandidate[]>
  ): {
    resolvedSteps: ExecutionProviderStep[];
    unresolvedList: Array<{ capability: string; reason: string; suggestedAlternatives?: string[] }>;
  } {
    const resolvedSteps: ExecutionProviderStep[] = [];
    const unresolvedList: Array<{ capability: string; reason: string; suggestedAlternatives?: string[] }> = [];

    capabilities.forEach((cap, idx) => {
      const candidates = candidateMap.get(cap.name) || [];
      const result = this.strategy.selectBestProvider(cap.name, candidates);

      if (result) {
        const { selected, explanation } = result;
        resolvedSteps.push({
          stepId: idx + 1,
          title: `Execute ${cap.displayName} via ${selected.merchant.alias}`,
          capability: cap.name,
          provider: {
            id: selected.listing._id?.toString() || selected.listing.providerId,
            providerId: selected.listing.providerId,
            merchantId: selected.merchant.id,
            merchantAlias: selected.merchant.alias,
            walletAddress: selected.merchant.walletAddress,
            isVerified: selected.merchant.isVerified,
            trustScore: selected.merchant.trustScore,
            pricePerCall: selected.listing.pricePerCall,
            supportedNetworks: selected.listing.supportedNetworks || ["Base Sepolia Testnet"],
          },
          explanation,
          inputParams: { capability: cap.name, category: cap.category },
          status: "PENDING",
        });
      } else {
        unresolvedList.push({
          capability: cap.name,
          reason: `Zero matching provider listings active in Bazaar for capability '${cap.name}'`,
          suggestedAlternatives: cap.suggestedAlternatives || ["financial-analysis", "web-search"],
        });
      }
    });

    return { resolvedSteps, unresolvedList };
  }
}

export const providerSelection = new ProviderSelection();
