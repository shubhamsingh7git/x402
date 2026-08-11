import { IProviderListing } from "../models/ProviderListing.model";
import { IBazaarRankedCandidate, IBazaarSearchParams } from "./BazaarTypes";

export class BazaarRanking {
  scoreAndRank(listings: IProviderListing[], params?: IBazaarSearchParams): IBazaarRankedCandidate[] {
    const candidates: IBazaarRankedCandidate[] = listings.map((listing: any) => {
      const merchantObj = listing.merchantId || {};
      const isVerified = merchantObj.status === "Verified" || merchantObj.status === "VERIFIED";

      // Derived telemetry metrics
      const verificationScore = isVerified ? 100 : 50;
      const trustScore = isVerified ? 98 : 75;
      const latencyMs = (listing.metadata?.latencyMs as number) || 120;
      const successRate = (listing.metadata?.successRate as number) || 99.5;
      const price = listing.pricePerCall || 0.01;

      // Composite scoring algorithm
      // W_ver = 0.30, W_trust = 0.25, W_success = 0.25, W_lat = 0.10, W_price = 0.10
      const latencyScore = Math.max(0, 100 - (latencyMs / 10));
      const priceScore = Math.max(0, 100 - (price * 1000));

      const compositeScore = Number(
        (
          verificationScore * 0.30 +
          trustScore * 0.25 +
          successRate * 0.25 +
          latencyScore * 0.10 +
          priceScore * 0.10
        ).toFixed(2)
      );

      return {
        listing,
        merchant: {
          id: merchantObj._id?.toString() || "",
          alias: merchantObj.alias || "Unknown Merchant",
          walletAddress: merchantObj.walletAddress || "",
          status: merchantObj.status || "Pending",
          isVerified,
          trustScore,
        },
        metrics: {
          verificationScore,
          trustScore,
          latencyMs,
          successRate,
          compositeScore,
        },
      };
    });

    const sortBy = params?.sortBy || "rank";
    const sortOrder = params?.sortOrder || "desc";

    candidates.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortBy === "rank") {
        valA = a.metrics.compositeScore;
        valB = b.metrics.compositeScore;
      } else if (sortBy === "latency") {
        valA = a.metrics.latencyMs;
        valB = b.metrics.latencyMs;
        // For latency, lower is better
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else if (sortBy === "price") {
        valA = a.listing.pricePerCall;
        valB = b.listing.pricePerCall;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else if (sortBy === "trust") {
        valA = a.metrics.trustScore;
        valB = b.metrics.trustScore;
      } else {
        valA = a.metrics.compositeScore;
        valB = b.metrics.compositeScore;
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return candidates;
  }
}

export const bazaarRanking = new BazaarRanking();
