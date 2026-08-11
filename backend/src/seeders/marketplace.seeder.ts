import { marketplaceService } from "../marketplace/MarketplaceService";
import { MarketplaceStatusEnum } from "../marketplace/MarketplaceStatus";
import { logger } from "../utils/logger";

export async function seedMarketplaceData(): Promise<void> {
  try {
    const existing = await marketplaceService.searchProviders({ limit: 5 });
    if (existing.items.length > 0) return;

    logger.info("🌱 Seeding Marketplace initial enterprise profiles & SLA data...");

    const p1 = await marketplaceService.createProviderProfile({
      providerId: "prov_alpha_001",
      merchantAlias: "Alpha Compute Merchant",
      displayName: "Alpha AI Compute Engine",
      description: "High-performance GPU-accelerated inference engine for complex financial analysis and market prediction.",
      category: "Analytics & Finance",
      capabilities: ["financial-analysis", "market-data"],
      contactEmail: "contact@alphacompute.ai",
      website: "https://alphacompute.ai",
      status: MarketplaceStatusEnum.ACTIVE,
      visibility: "PUBLIC",
      supportedRegions: ["US-EAST", "EU-WEST", "GLOBAL"],
      businessVerified: true,
      certifications: ["ENTERPRISE", "VERIFIED"],
      pricingModel: { tierName: "ENTERPRISE", pricePerCall: 0.02, monthlyQuota: 500000 },
      slaProfile: { uptimePercentage: 99.99, maxLatencyMs: 80, supportLevel: "ENTERPRISE_247" },
    });

    await marketplaceService.updateProviderStatus(p1.providerId, MarketplaceStatusEnum.ACTIVE);

    await marketplaceService.addReview(p1.providerId, {
      rating: 5,
      title: "Unmatched SLA and Latency",
      comment: "Consistently delivers under 80ms latency for real-time market data requests. Enterprise grade compliance.",
    });

    const p2 = await marketplaceService.createProviderProfile({
      providerId: "prov_beta_002",
      merchantAlias: "Beta Intelligence Merchant",
      displayName: "Beta Autonomous Search Protocol",
      description: "Distributed web crawler and semantic extraction engine for multi-agent capabilities.",
      category: "Web & Search",
      capabilities: ["web-search", "sentiment-analysis"],
      contactEmail: "support@betaintelligence.com",
      status: MarketplaceStatusEnum.ACTIVE,
      visibility: "PUBLIC",
      supportedRegions: ["GLOBAL"],
      businessVerified: true,
      certifications: ["VERIFIED", "COMMUNITY"],
      pricingModel: { tierName: "PAY_PER_CALL", pricePerCall: 0.015, monthlyQuota: 200000 },
      slaProfile: { uptimePercentage: 99.9, maxLatencyMs: 140, supportLevel: "STANDARD" },
    });

    await marketplaceService.updateProviderStatus(p2.providerId, MarketplaceStatusEnum.ACTIVE);

    await marketplaceService.addReview(p2.providerId, {
      rating: 4,
      title: "Reliable Search Provider",
      comment: "Great response time and accurate data extraction. Very affordable per-call rates.",
    });

    logger.info("✅ Marketplace seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Marketplace seeder warning: ${err.message}`);
  }
}
