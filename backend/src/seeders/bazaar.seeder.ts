import { Capability } from "../models/Capability.model";
import { ProviderListing } from "../models/ProviderListing.model";
import { Merchant } from "../models/Merchant";
import { logger } from "../utils/logger";

export async function seedBazaarData(): Promise<void> {
  try {
    const existingCaps = await Capability.countDocuments();
    if (existingCaps === 0) {
      const defaultCaps = [
        {
          name: "financial-analysis",
          displayName: "Financial Market Analysis",
          description: "Real-time stock, crypto, and macroeconomic analytical inference",
          category: "FINANCE",
          tags: ["crypto", "stocks", "intelligence"],
          version: "1.0.0",
          status: "ACTIVE",
        },
        {
          name: "market-data",
          displayName: "Live Market Data Feed",
          description: "Sub-second price feeds and order book depth data",
          category: "DATA",
          tags: ["realtime", "websocket", "prices"],
          version: "1.2.0",
          status: "ACTIVE",
        },
        {
          name: "web-search",
          displayName: "Autonomous Web Search",
          description: "Search engine web scraping and document extraction for LLMs",
          category: "AI",
          tags: ["search", "web", "scraping"],
          version: "2.0.0",
          status: "ACTIVE",
        },
        {
          name: "classification",
          displayName: "Text & Document Classification",
          description: "NLP sentiment analysis and document categorization",
          category: "AI",
          tags: ["nlp", "text", "classifier"],
          version: "1.0.0",
          status: "ACTIVE",
        },
        {
          name: "sentiment-analysis",
          displayName: "Social Media Sentiment Engine",
          description: "Aggregate sentiment scores from Twitter/X, Reddit, and News",
          category: "ANALYTICS",
          tags: ["social", "sentiment", "nlp"],
          version: "1.1.0",
          status: "ACTIVE",
        },
      ];

      await Capability.insertMany(defaultCaps);
      logger.info("🌱 Default Bazaar Capabilities seeded successfully");
    }

    const existingProviders = await ProviderListing.countDocuments();
    if (existingProviders === 0) {
      const merchants = await Merchant.find({ isDeleted: false }).limit(5);

      if (merchants.length > 0) {
        const defaultProviders = [
          {
            providerId: "prov_openai_financial",
            merchantId: merchants[0]._id,
            capabilities: ["financial-analysis", "market-data"],
            supportedNetworks: ["Base Sepolia Testnet", "Algorand TestNet"],
            pricePerCall: 0.05,
            currency: "USDC",
            availability: true,
            status: "ACTIVE",
            metadata: { latencyMs: 140, successRate: 99.8, providerAlias: merchants[0].alias },
          },
          {
            providerId: "prov_coingecko_pro",
            merchantId: merchants[1 % merchants.length]._id,
            capabilities: ["market-data", "sentiment-analysis"],
            supportedNetworks: ["Base Sepolia Testnet"],
            pricePerCall: 0.01,
            currency: "USDC",
            availability: true,
            status: "ACTIVE",
            metadata: { latencyMs: 85, successRate: 99.9, providerAlias: merchants[1 % merchants.length].alias },
          },
          {
            providerId: "prov_web_search_v2",
            merchantId: merchants[2 % merchants.length]._id,
            capabilities: ["web-search", "classification"],
            supportedNetworks: ["Base Sepolia Testnet", "Solana Devnet"],
            pricePerCall: 0.025,
            currency: "USDC",
            availability: true,
            status: "ACTIVE",
            metadata: { latencyMs: 210, successRate: 99.2, providerAlias: merchants[2 % merchants.length].alias },
          },
        ];

        await ProviderListing.insertMany(defaultProviders);
        logger.info("🌱 Default Bazaar Provider Listings seeded successfully");
      }
    }
  } catch (error) {
    logger.error({ error }, "❌ Error seeding Bazaar data");
  }
}
