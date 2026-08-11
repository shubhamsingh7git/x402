import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../config/env";
import { User } from "../models/User";
import { Merchant } from "../models/Merchant";
import { Policy } from "../models/Policy";
import { Transaction } from "../models/Transaction";
import { AuditLog } from "../models/AuditLog";
import { AgentRun } from "../models/AgentRun";
import { ApiService } from "../models/ApiService";
import { MERCHANT_STATUS, TRANSACTION_STATUS, AGENT_STATUS } from "../constants/status";
import { logger } from "../utils/logger";

const seed = async () => {
  try {
    logger.info("🌱 Starting database seed...");
    await mongoose.connect(env.mongoUri, { dbName: "x402" });

    // Clear existing collection data
    await Promise.all([
      User.deleteMany({}),
      Merchant.deleteMany({}),
      Policy.deleteMany({}),
      Transaction.deleteMany({}),
      AuditLog.deleteMany({}),
      AgentRun.deleteMany({}),
      ApiService.deleteMany({}),
    ]);

    logger.info("🧹 Cleaned existing database collections");

    // 1. Create Default Admin User
    const hashedPassword = await bcrypt.hash("Admin123!", 12);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@x402.io",
      password: hashedPassword,
      role: "admin",
      walletAddress: "0x7F2A8492B1039E82C41A3B92",
    });

    // 2. Create 5 Meaningful Merchants
    const merchantsData = [
      {
        alias: "OpenAI API",
        walletAddress: "eip155:84532:0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B",
        address: "eip155:84532:0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B",
        network: "Base Sepolia Testnet",
        status: MERCHANT_STATUS.VERIFIED,
      },
      {
        alias: "Weather API",
        walletAddress: "eip155:84532:0x5B4A3C2D1E0F9E8D7C6B5A43210FEDCBA9876543",
        address: "eip155:84532:0x5B4A3C2D1E0F9E8D7C6B5A43210FEDCBA9876543",
        network: "Base Sepolia Testnet",
        status: MERCHANT_STATUS.VERIFIED,
      },
      {
        alias: "Research API",
        walletAddress: "eip155:84532:0x8D9A7B6C5D4E3F2A1B0C9D8E7F6A5B4C3D2E1F0",
        address: "eip155:84532:0x8D9A7B6C5D4E3F2A1B0C9D8E7F6A5B4C3D2E1F0",
        network: "Base Sepolia Testnet",
        status: MERCHANT_STATUS.VERIFIED,
      },
      {
        alias: "Sentiment API",
        walletAddress: "eip155:84532:0x2D5A8C9B0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5",
        address: "eip155:84532:0x2D5A8C9B0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5",
        network: "Base Sepolia Testnet",
        status: MERCHANT_STATUS.VERIFIED,
      },
      {
        alias: "Market Data API",
        walletAddress: "eip155:84532:0x9F8E7D6C5B4A3F2E1D0C9B8A7F6E5D4C3B2A1F0",
        address: "eip155:84532:0x9F8E7D6C5B4A3F2E1D0C9B8A7F6E5D4C3B2A1F0",
        network: "Base Sepolia Testnet",
        status: MERCHANT_STATUS.VERIFIED,
      },
    ];

    const createdMerchants = await Merchant.insertMany(merchantsData);
    logger.info(`✅ Seeded ${createdMerchants.length} Merchants`);

    // 3. Create 5 Policies (One for each merchant)
    const policiesData = createdMerchants.map((merchant, index) => ({
      merchant: merchant._id,
      userId: adminUser._id,
      dailyBudget: 10.0,
      transactionLimit: 0.05,
      maxTransactionsPerMinute: 30,
      enabled: true,
      killSwitch: false,
      version: 1,
      createdBy: adminUser.email,
    }));

    const createdPolicies = await Policy.insertMany(policiesData);
    logger.info(`✅ Seeded ${createdPolicies.length} Policies`);

    // 4. Create 30 Transactions across past 7 days
    const transactions = [];
    const statuses = [TRANSACTION_STATUS.APPROVED, TRANSACTION_STATUS.SETTLED, TRANSACTION_STATUS.DENIED];

    for (let i = 0; i < 30; i++) {
      const merchant = createdMerchants[i % createdMerchants.length];
      const status = i % 5 === 0 ? TRANSACTION_STATUS.DENIED : i % 2 === 0 ? TRANSACTION_STATUS.SETTLED : TRANSACTION_STATUS.APPROVED;
      const daysAgo = Math.floor(i / 4);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - (i % 3) * 3600 * 1000);

      transactions.push({
        merchant: merchant.alias,
        amount: Number((0.01 + (i % 5) * 0.01).toFixed(2)),
        status,
        txHash: status === TRANSACTION_STATUS.DENIED ? "0x0000000000000000000000000000000000000000" : `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.substring(0, 42),
        wallet: "0x7F2A8492B1039E82C41A3B92",
        network: merchant.network,
        scheme: "Exact",
        policyDecision: status === TRANSACTION_STATUS.DENIED ? "Denied" : "Approved",
        decisionReason: status === TRANSACTION_STATUS.DENIED ? "Exceeds per-tx budget cap ($0.05)" : "Compliant with threshold",
        createdAt,
      });
    }

    await Transaction.insertMany(transactions);
    logger.info(`✅ Seeded ${transactions.length} Transactions`);

    // 5. Create 50 Audit Logs
    const actions = ["AUTH_LOGIN", "MERCHANT_CREATED", "POLICY_UPDATED", "PAYMENT_APPROVED", "POLICY_VIOLATION"];
    const auditLogs = [];
    for (let i = 0; i < 50; i++) {
      const action = actions[i % actions.length];
      const createdAt = new Date(Date.now() - i * 4 * 3600 * 1000);
      auditLogs.push({
        action,
        user: adminUser._id,
        requestId: `req-${Date.now()}-${i}`,
        ip: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        metadata: { detail: `Audit log sample entry #${i + 1} for ${action}` },
        createdAt,
      });
    }

    await AuditLog.insertMany(auditLogs);
    logger.info(`✅ Seeded ${auditLogs.length} Audit Logs`);

    // 6. Create 10 Agent Runs with rich step definitions
    const agentRuns = [];
    for (let i = 0; i < 10; i++) {
      const status = i === 0 ? AGENT_STATUS.EXECUTING : i % 4 === 0 ? AGENT_STATUS.FAILED : AGENT_STATUS.COMPLETED;
      agentRuns.push({
        query: `Research DPDP Act compliance rubric & market query #${i + 1}`,
        status,
        totalCost: Number((0.02 * (i + 1)).toFixed(2)),
        duration: 1200 + i * 300,
        userId: adminUser._id,
        steps: [
          {
            id: 1,
            title: "Web Search",
            type: "SEARCH",
            status: AGENT_STATUS.COMPLETED,
            startedAt: new Date(Date.now() - 60000),
            completedAt: new Date(Date.now() - 30000),
            duration: 800,
            estimatedCost: 0.01,
            actualCost: 0.01,
            cost: 0.01,
          },
          {
            id: 2,
            title: "AI Summarization",
            type: "SUMMARY",
            status: status === AGENT_STATUS.FAILED ? AGENT_STATUS.FAILED : AGENT_STATUS.COMPLETED,
            startedAt: new Date(Date.now() - 30000),
            completedAt: status === AGENT_STATUS.FAILED ? undefined : new Date(),
            duration: 400,
            estimatedCost: 0.02,
            actualCost: 0.02,
            cost: 0.02,
          },
        ],
        createdAt: new Date(Date.now() - i * 12 * 3600 * 1000),
      });
    }

    await AgentRun.insertMany(agentRuns);
    logger.info(`✅ Seeded ${agentRuns.length} Agent Runs`);

    // 7. Seed ApiServices
    const apiServicesData = createdMerchants.map((m) => ({
      serviceName: `${m.alias} Endpoint`,
      endpoint: `https://api.${m.alias.toLowerCase().replace(/\s+/g, "")}.com/v1/query`,
      price: 0.02,
      merchant: m._id as any,
      network: m.network,
      enabled: true,
    }));

    await ApiService.insertMany(apiServicesData);
    logger.info(`✅ Seeded ${apiServicesData.length} API Services`);

    logger.info("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "❌ Database seeding failed");
    process.exit(1);
  }
};

seed();
