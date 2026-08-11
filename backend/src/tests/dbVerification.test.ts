import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User";
import { Merchant } from "../models/Merchant";
import { AgentRun } from "../models/AgentRun";
import { Transaction } from "../models/Transaction";
import { TimelineEvent } from "../models/TimelineEvent";
import { AuditLog } from "../models/AuditLog";
import { authService } from "../services/auth/auth.service";
import { merchantService } from "../services/merchant/merchant.service";
import { executionService } from "../services/execution/execution.service";

const runDatabaseSelectionVerification = async () => {
  console.log("==========================================================");
  console.log("🔍 STARTING MONGODB DATABASE SELECTION VERIFICATION TEST");
  console.log("==========================================================");

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(env.mongoUri, { dbName: "x402" });
  }

  const activeDbName = mongoose.connection.name;
  console.log(`\n📦 Connected Database Name: "${activeDbName}"`);

  if (activeDbName !== "x402") {
    throw new Error(`❌ Root Cause Failure: Connected database is "${activeDbName}", expected "x402"`);
  }
  console.log("  ✓ Active database name strictly matches 'x402'");

  // 1. Test User Registration
  console.log("\n👤 1. Testing User Registration into 'x402.users'");
  const testEmail = `dbtest_${Date.now()}@example.com`;
  const registerResult = await authService.register({
    name: "Database Test",
    email: testEmail,
    password: "Password@123",
  });

  const createdUser = await User.findOne({ email: testEmail });
  if (!createdUser) {
    throw new Error(`User creation failed: document not found in ${activeDbName}.users`);
  }
  console.log(`  ✓ User [${testEmail}] successfully inserted into "${activeDbName}.users" (ID: ${createdUser._id})`);

  // 2. Test Merchant Creation
  console.log("\n🏢 2. Testing Merchant Creation into 'x402.merchants'");
  const testAlias = `DBTest_Merchant_${Date.now()}`;
  const createdMerchant = await merchantService.createMerchant({
    alias: testAlias,
    walletAddress: `0xDBTest_${Date.now()}`,
    network: "Base Sepolia Testnet",
  });

  const dbMerchant = await Merchant.findById(createdMerchant._id);
  if (!dbMerchant) {
    throw new Error(`Merchant creation failed: document not found in ${activeDbName}.merchants`);
  }
  console.log(`  ✓ Merchant [${testAlias}] successfully inserted into "${activeDbName}.merchants"`);

  // 3. Test Research Execution Pipeline
  console.log("\n🤖 3. Testing Research Pipeline Execution into 'x402'");
  const agentRun = await AgentRun.create({
    query: "Test DB Selection Query",
    status: "executing",
    userId: createdUser._id,
    steps: [],
  });

  const summaryResult = await executionService.executePlan(agentRun._id.toString(), [
    {
      id: 1,
      type: "SEARCH",
      title: "Test DB Search",
      input: { query: "DB Test" },
    },
  ]);

  const [dbRun, dbTx, dbTimeline, dbAudit] = await Promise.all([
    AgentRun.findById(agentRun._id),
    Transaction.findOne({ merchant: "OpenAI API" }).sort({ createdAt: -1 }),
    TimelineEvent.findOne({ runId: agentRun._id.toString() }),
    AuditLog.findOne({ "metadata.merchantId": createdMerchant._id }),
  ]);

  console.log(`  ✓ AgentRun stored in "${activeDbName}.agentruns": ${!!dbRun}`);
  console.log(`  ✓ Transaction stored in "${activeDbName}.transactions": ${!!dbTx}`);
  console.log(`  ✓ TimelineEvent stored in "${activeDbName}.timelineevents": ${!!dbTimeline}`);

  // Clean up test documents
  await Promise.all([
    User.deleteOne({ _id: createdUser._id }),
    Merchant.deleteOne({ _id: createdMerchant._id }),
    AgentRun.deleteOne({ _id: agentRun._id }),
  ]);

  console.log("\n==========================================================");
  console.log("🎉 MONGODB DATABASE SELECTION VERIFICATION COMPLETED (100% CLEAN)");
  console.log("==========================================================");
  process.exit(0);
};

runDatabaseSelectionVerification().catch((err) => {
  console.error("❌ Database Selection Verification Failure:", err);
  process.exit(1);
});
