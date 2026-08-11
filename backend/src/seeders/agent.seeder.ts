import { agentRegistry } from "../agents/AgentRegistry";
import { AgentStatusEnum } from "../agents/AgentStatus";
import { logger } from "../utils/logger";

export async function seedAgentData(): Promise<void> {
  try {
    const existing = await agentRegistry.getAllAgents();
    if (existing.length > 0) return;

    logger.info("🌱 Seeding Agent Platform specialized agents...");

    await agentRegistry.registerAgent({
      agentId: "ag_research_01",
      agentName: "Autonomous Research Agent",
      role: "ResearchAgent",
      capabilities: ["financial-analysis", "market-data", "web-search"],
      confidenceScore: 0.95,
      costPerCallUsd: 0.015,
      averageLatencyMs: 110,
      status: AgentStatusEnum.IDLE,
      permissions: ["EXECUTE_CAPABILITY", "READ_MEMORY", "WRITE_MEMORY"],
      systemPrompt: "Decompose complex user research tasks into analytical subqueries.",
    });

    await agentRegistry.registerAgent({
      agentId: "ag_finance_02",
      agentName: "Quantitative Finance Agent",
      role: "FinanceAgent",
      capabilities: ["financial-analysis", "risk-assessment"],
      confidenceScore: 0.92,
      costPerCallUsd: 0.02,
      averageLatencyMs: 90,
      status: AgentStatusEnum.IDLE,
      permissions: ["EXECUTE_CAPABILITY", "WRITE_MEMORY"],
      systemPrompt: "Evaluate financial metrics, revenue growth, and market risks.",
    });

    await agentRegistry.registerAgent({
      agentId: "ag_web_03",
      agentName: "Distributed Search & Web Agent",
      role: "WebSearchAgent",
      capabilities: ["web-search", "sentiment-analysis"],
      confidenceScore: 0.88,
      costPerCallUsd: 0.01,
      averageLatencyMs: 140,
      status: AgentStatusEnum.IDLE,
      permissions: ["EXECUTE_CAPABILITY"],
      systemPrompt: "Crawl web sources and extract sentiment metrics.",
    });

    await agentRegistry.registerAgent({
      agentId: "ag_compliance_04",
      agentName: "Governance & Risk Compliance Agent",
      role: "ComplianceAgent",
      capabilities: ["compliance-check", "risk-assessment"],
      confidenceScore: 0.98,
      costPerCallUsd: 0.005,
      averageLatencyMs: 40,
      status: AgentStatusEnum.IDLE,
      permissions: ["EVALUATE_GOVERNANCE", "REQUEST_APPROVAL"],
      systemPrompt: "Ensure all execution subtasks follow strict budget and risk governance.",
    });

    logger.info("✅ Agent Platform seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Agent seeder warning: ${err.message}`);
  }
}
