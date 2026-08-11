import { serviceRegistry } from "../registry/service.registry";

const testServiceRegistry = async () => {
  console.log("🧪 Testing ServiceRegistry lookup and price resolution...");

  const searchSvc = await serviceRegistry.getService("svc_search");
  if (!searchSvc || searchSvc.price !== 0.01) {
    throw new Error(`Expected search service with price 0.01, got ${JSON.stringify(searchSvc)}`);
  }

  const resolvedPrice = await serviceRegistry.resolvePrice("svc_financial");
  if (resolvedPrice !== 0.02) {
    throw new Error(`Expected resolved price 0.02, got ${resolvedPrice}`);
  }

  console.log("✅ ServiceRegistry test PASSED!");
};

testServiceRegistry().catch((err) => {
  console.error("❌ ServiceRegistry test failed:", err);
  process.exit(1);
});
