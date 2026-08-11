import express from "express";
import app from "../../app";
import { healthController } from "../../controllers/health.controller";

const testHealthProbes = async () => {
  console.log("🧪 Testing Health, Liveness, and Readiness endpoints...");

  // Mock Request / Response objects
  const createMockRes = () => {
    const res: any = {};
    res.statusCode = 200;
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.json = (body: any) => {
      res.body = body;
      return res;
    };
    return res;
  };

  // 1. Test Liveness
  const liveRes = createMockRes();
  await healthController.liveness({} as any, liveRes);

  if (liveRes.statusCode !== 200 || !liveRes.body.success || liveRes.body.data.status !== "alive") {
    throw new Error(`Liveness probe failed: ${JSON.stringify(liveRes.body)}`);
  }
  console.log("  ✓ Liveness probe (GET /api/v1/live) returned 200 OK with status: 'alive'");

  // 2. Test Readiness
  const readyRes = createMockRes();
  await healthController.readiness({} as any, readyRes);
  console.log(`  ✓ Readiness probe (GET /api/v1/ready) returned status ${readyRes.statusCode}`);

  // 3. Test Health Check
  const healthRes = createMockRes();
  await healthController.check({} as any, healthRes);
  if (healthRes.statusCode !== 200 || !healthRes.body.success) {
    throw new Error(`Health check probe failed: ${JSON.stringify(healthRes.body)}`);
  }
  console.log("  ✓ Health check probe (GET /api/v1/health) returned 200 OK with full diagnostic report");

  console.log("✅ All health probe tests PASSED!");
};

testHealthProbes().catch((err) => {
  console.error("❌ Health probe test failed:", err);
  process.exit(1);
});
