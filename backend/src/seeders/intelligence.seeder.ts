import { knowledgeGraph } from "../intelligence/KnowledgeGraph";
import { longTermMemory } from "../intelligence/LongTermMemory";
import { optimizationEngine } from "../intelligence/OptimizationEngine";
import { knowledgeRepository } from "../repositories/KnowledgeRepository";
import { logger } from "../utils/logger";

export async function seedIntelligenceData(): Promise<void> {
  try {
    const nodeCount = await knowledgeRepository.countNodes();
    if (nodeCount > 0) return;

    logger.info("🌱 Seeding Enterprise Intelligence Knowledge Graph & Memories...");

    // Knowledge Nodes
    await knowledgeGraph.addNode("node_prov_001", "PROVIDER", "Alpha Compute Merchant", { region: "US-EAST", status: "ACTIVE" });
    await knowledgeGraph.addNode("node_cap_fin", "CAPABILITY", "financial-analysis", { domain: "Finance" });
    await knowledgeGraph.addNode("node_ag_res", "AGENT", "Autonomous Research Agent", { role: "ResearchAgent" });
    await knowledgeGraph.addNode("node_pol_max", "POLICY", "Global Spend Limit Policy", { maxAmountUsd: 100 });

    // Knowledge Edges
    await knowledgeGraph.addEdge("node_prov_001", "node_cap_fin", "OFFERS_CAPABILITY", 1.0);
    await knowledgeGraph.addEdge("node_ag_res", "node_cap_fin", "ROUTED_TO", 0.95);
    await knowledgeGraph.addEdge("node_ag_res", "node_pol_max", "ENFORCES_POLICY", 0.98);

    // Semantic Memories
    await longTermMemory.recordSemanticMemory({
      title: "Alpha Compute Merchant Financial SLA SLA Target",
      content: "Alpha Compute Merchant delivers sub-80ms execution latency for financial analysis queries with 99.99% uptime compliance.",
      memoryType: "SEMANTIC",
      tags: ["financial-analysis", "sla", "alpha-compute"],
    });

    await longTermMemory.recordSemanticMemory({
      title: "Consensus Strategy Policy Resolution",
      content: "High-value transaction subtasks automatically trigger CONSENSUS execution strategy requiring a minimum of 2 matching responses.",
      memoryType: "PROCEDURAL",
      tags: ["consensus", "governance", "strategy"],
    });

    // Optimization Recommendations
    await optimizationEngine.generateRecommendation({
      category: "COST",
      title: "Route Financial Subtasks to Alpha Compute Pay-Per-Call Tier",
      description: "Switching financial-analysis subtasks to Alpha Compute Merchant's volume tier reduces per-call cost by 18%.",
      targetEntityId: "node_prov_001",
      targetEntityType: "PROVIDER",
      impactScore: 88,
      estimatedSavingsUsd: 450.00,
    });

    await optimizationEngine.generateRecommendation({
      category: "OPERATIONAL",
      title: "Increase Concurrency Limits for Parallel Subtask Routing",
      description: "Increasing max parallel concurrency from 5 to 8 reduces total multi-agent session latency by 24ms.",
      targetEntityId: "node_ag_res",
      targetEntityType: "AGENT",
      impactScore: 78,
    });

    logger.info("✅ Enterprise Intelligence seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Intelligence seeder warning: ${err.message}`);
  }
}
