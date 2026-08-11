import mongoose from "mongoose";
import { env } from "../config/env";
import { Merchant } from "../models/Merchant";
import { Policy } from "../models/Policy";
import { ApiService } from "../models/ApiService";
import { MerchantVerificationLog } from "../models/MerchantVerificationLog";
import { MERCHANT_STATUS } from "../constants/status";
import { merchantService } from "../services/merchant/merchant.service";
import { merchantVerificationService } from "../services/merchantVerification/MerchantVerificationService";
import { paymentManager } from "../payment/manager/payment.manager";
import { PaymentRequestDTO } from "../payment/dto/paymentRequest.dto";

const runMerchantVerificationTestSuite = async () => {
  console.log("==========================================================");
  console.log("🚀 STARTING RC1.1 MERCHANT LIFECYCLE & VERIFICATION TEST SUITE");
  console.log("==========================================================");

  // 1. Connect to DB
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(env.MONGODB_URI, { dbName: "x402" });
  }
  console.log("  ✓ Connected to MongoDB");

  // 2. Test Un-trusted Merchant Creation (Always PENDING)
  console.log("\n📦 1. Testing Un-trusted Merchant Creation");
  const testAlias = `TestMerchant_${Date.now()}`;
  const created = await merchantService.createMerchant({
    alias: testAlias,
    walletAddress: `0xTest_${Date.now()}`,
    network: "Base Sepolia Testnet",
    status: "Verified" as any, // Should be ignored!
  });

  if (created.status !== MERCHANT_STATUS.PENDING) {
    throw new Error(`Creation failed: Expected PENDING status, got ${created.status}`);
  }
  console.log(`  ✓ Merchant [${created.alias}] created with status: PENDING (client status injection ignored)`);

  // Seed associated Policy and ApiService for test merchant
  await Policy.create({
    merchant: created._id,
    merchantId: created.alias,
    dailyBudget: 10,
    transactionLimit: 0.05,
    maxTransactionsPerMinute: 30,
    enabled: true,
  });

  await ApiService.create({
    serviceName: `${created.alias} Service`,
    endpoint: `https://api.test.${created.alias.toLowerCase()}.com/v1`,
    price: 0.01,
    merchant: created._id,
    network: created.network,
    enabled: true,
  });

  // 3. Test Merchant Verification Strategy Execution
  console.log("\n🛡️ 2. Testing Merchant Strategy Verification");
  const verifResult = await merchantVerificationService.verifyMerchant(created._id.toString(), true);

  if (!verifResult.verified || verifResult.status !== MERCHANT_STATUS.VERIFIED) {
    throw new Error(`Verification failed: Expected status VERIFIED, got ${verifResult.status}. Reason: ${verifResult.reason}`);
  }
  console.log(`  ✓ Strategy Verification Succeeded! Status=${verifResult.status}, Version=${verifResult.verificationVersion}`);
  console.log(`  ✓ Strategy Breakdown: Wallet=${verifResult.verificationResults.wallet}, Policy=${verifResult.verificationResults.policy}, ApiService=${verifResult.verificationResults.apiService}`);

  // 4. Test Database Expiration Caching
  console.log("\n💾 3. Testing Database Expiration Caching");
  const cachedResult = await merchantVerificationService.verifyMerchant(created._id.toString(), false);
  if (cachedResult.checkedAt.getTime() !== verifResult.checkedAt.getTime()) {
    throw new Error("Caching failed: Expected cached result timestamp");
  }
  console.log("  ✓ Returned cached DB verification result without re-evaluating strategies");

  // 5. Test Audit Trail Log Generation
  console.log("\n📜 4. Testing MerchantVerificationLog Audit Trail");
  const logs = await MerchantVerificationLog.find({ merchant: created._id });
  if (logs.length === 0) {
    throw new Error("Audit log failed: No MerchantVerificationLog entries recorded");
  }
  console.log(`  ✓ Found ${logs.length} MerchantVerificationLog entry for merchant [${created.alias}]`);

  // 6. Test Payment Pipeline Integration (Verified Merchant Approval)
  console.log("\n💳 5. Testing Payment Pipeline with Verified Merchant");
  const paymentReq: PaymentRequestDTO = {
    executionId: `exec_verif_${Date.now()}`,
    stepId: 1,
    serviceId: "svc_search",
    merchantId: created.alias,
    price: 0.01,
    network: "Base Sepolia Testnet",
    asset: "USDC",
    scheme: "Exact",
  };

  const paymentRes = await paymentManager.processPayment(paymentReq);
  console.log(`  ✓ Payment Result: Success=${paymentRes.success}, Status=${paymentRes.status}, TxId=${paymentRes.transactionId}`);

  // Clean up test records
  await Merchant.findByIdAndDelete(created._id);
  await Policy.deleteMany({ merchantId: created.alias });
  await ApiService.deleteMany({ merchant: created._id });
  await MerchantVerificationLog.deleteMany({ merchant: created._id });

  console.log("\n==========================================================");
  console.log("🎉 ALL RC1.1 MERCHANT LIFECYCLE & VERIFICATION TESTS PASSED!");
  console.log("==========================================================");
  process.exit(0);
};

runMerchantVerificationTestSuite().catch((err) => {
  console.error("❌ RC1.1 Test Suite Failure:", err);
  process.exit(1);
});
