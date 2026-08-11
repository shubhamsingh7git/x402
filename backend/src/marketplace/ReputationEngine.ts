import { reviewRepository } from "../repositories/ReviewRepository";
import { providerReputationRepository } from "../repositories/ProviderReputationRepository";
import { providerProfileRepository } from "../repositories/ProviderProfileRepository";
import { MARKETPLACE_CONFIG } from "./MarketplaceConfig";
import { logger } from "../utils/logger";

export class ReputationEngine {
  async recalculateReputation(providerId: string): Promise<number> {
    const profile = await providerProfileRepository.findByProviderId(providerId);
    if (!profile) return 85.0;

    const avgRating = await reviewRepository.getAverageRating(providerId);
    const reviewCount = await reviewRepository.countByProviderId(providerId);

    // Weights: community (40%), SLA (30%), success (20%), verification (10%)
    const ratingNorm = (avgRating / 5.0) * 100; // 0-100 scale
    const slaScore = 99.5;
    const successScore = 99.0;
    const verifScore = profile.businessVerified ? 100 : 70;

    const weights = MARKETPLACE_CONFIG.reputation.weights;
    const finalScore = Number(
      (
        ratingNorm * weights.communityReviews +
        slaScore * weights.slaCompliance +
        successScore * weights.executionSuccess +
        verifScore * weights.verificationStatus
      ).toFixed(1)
    );

    // Update reputation collection
    await providerReputationRepository.upsert(providerId, {
      reputationScore: finalScore,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount,
      verificationBadge: profile.businessVerified,
      certifiedBadge: profile.certifications.length > 0,
    });

    // Update profile
    await providerProfileRepository.updateByProviderId(providerId, {
      reputationScore: finalScore,
    });

    logger.info(`⭐ ReputationEngine recalculated provider [${providerId}] score: ${finalScore} / 100`);
    return finalScore;
  }
}

export const reputationEngine = new ReputationEngine();
