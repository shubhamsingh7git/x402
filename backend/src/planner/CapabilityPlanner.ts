import { PlannerCapability, PlannerCapabilityPlan } from "./PlannerTypes";
import { PLANNER_CONFIG } from "./PlannerConfig";
import { capabilityRepository } from "../repositories/CapabilityRepository";

interface CacheEntry {
  data: PlannerCapabilityPlan;
  expiry: number;
}

export class CapabilityPlanner {
  private cache = new Map<string, CacheEntry>();

  async analyzePrompt(prompt: string): Promise<PlannerCapabilityPlan> {
    const startTime = Date.now();
    const cleanPrompt = prompt.trim().toLowerCase();
    const cacheKey = `cap_plan_${cleanPrompt}`;

    // Check 5-minute in-memory cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return {
        ...cached.data,
        estimatedPlanningTimeMs: Date.now() - startTime,
        fromCache: true,
      };
    }

    const availableCaps = await capabilityRepository.find({ status: "ACTIVE" });
    const extractedCapabilities: PlannerCapability[] = [];

    // Keyword & taxonomy extraction rules
    if (/stock|market|crypto|price|finance|fund|trade|btc|eth|aapl|tsla/i.test(prompt)) {
      const match = availableCaps.find((c) => c.name === "financial-analysis" || c.name === "market-data");
      extractedCapabilities.push({
        name: match ? match.name : "financial-analysis",
        displayName: match ? match.displayName : "Financial Market Analysis",
        category: "FINANCE",
        required: true,
        estimatedComplexity: "MEDIUM",
        suggestedAlternatives: ["market-data"],
      });
    }

    if (/search|web|google|find|news|latest|article|scrape/i.test(prompt)) {
      const match = availableCaps.find((c) => c.name === "web-search");
      extractedCapabilities.push({
        name: match ? match.name : "web-search",
        displayName: match ? match.displayName : "Autonomous Web Search",
        category: "AI",
        required: true,
        estimatedComplexity: "MEDIUM",
      });
    }

    if (/sentiment|opinion|reddit|twitter|x|social/i.test(prompt)) {
      const match = availableCaps.find((c) => c.name === "sentiment-analysis");
      extractedCapabilities.push({
        name: match ? match.name : "sentiment-analysis",
        displayName: match ? match.displayName : "Social Media Sentiment Engine",
        category: "ANALYTICS",
        required: false,
        estimatedComplexity: "LOW",
      });
    }

    if (/classify|categorize|nlp|document|pdf|type/i.test(prompt)) {
      const match = availableCaps.find((c) => c.name === "classification");
      extractedCapabilities.push({
        name: match ? match.name : "classification",
        displayName: match ? match.displayName : "Text & Document Classification",
        category: "AI",
        required: false,
        estimatedComplexity: "LOW",
      });
    }

    // Default fallback capability if none extracted
    if (extractedCapabilities.length === 0) {
      extractedCapabilities.push({
        name: "financial-analysis",
        displayName: "Financial Market Analysis",
        category: "FINANCE",
        required: true,
        estimatedComplexity: "MEDIUM",
        suggestedAlternatives: ["market-data", "web-search"],
      });
    }

    const estimatedTotalCost = Number((extractedCapabilities.length * 0.02).toFixed(4));
    const planningDuration = Date.now() - startTime;

    const result: PlannerCapabilityPlan = {
      prompt,
      requiredCapabilities: extractedCapabilities,
      estimatedTotalCost,
      estimatedProvidersCount: extractedCapabilities.length,
      estimatedPlanningTimeMs: planningDuration,
      fromCache: false,
    };

    // Cache capability extraction
    this.cache.set(cacheKey, {
      data: result,
      expiry: Date.now() + PLANNER_CONFIG.cacheTtlMs,
    });

    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const capabilityPlanner = new CapabilityPlanner();
