import { serviceRegistry } from "../gateway/ServiceRegistry";
import { gatewayRepository } from "../repositories/GatewayRepository";
import { serviceRegistryRepository } from "../repositories/ServiceRegistryRepository";
import { GatewayPolicyScopeEnum } from "../gateway/GatewayPolicies";
import { logger } from "../utils/logger";

export async function seedGatewayData(): Promise<void> {
  try {
    const count = await serviceRegistryRepository.count();
    if (count > 0) return;

    logger.info("🌱 Seeding API Gateway microservices, routes & policies...");

    await serviceRegistry.registerService("planner-service", "http://localhost:4000/api/v1/planner", "v1");
    await serviceRegistry.registerService("bazaar-service", "http://localhost:4000/api/v1/bazaar", "v1");
    await serviceRegistry.registerService("marketplace-service", "http://localhost:4000/api/v1/marketplace", "v1");
    await serviceRegistry.registerService("agents-service", "http://localhost:4000/api/v1/agents", "v1");
    await serviceRegistry.registerService("intelligence-service", "http://localhost:4000/api/v1/intelligence", "v1");
    await serviceRegistry.registerService("controlplane-service", "http://localhost:4000/api/v1/control-plane", "v1");
    await serviceRegistry.registerService("distributed-service", "http://localhost:4000/api/v1/distributed", "v1");

    await gatewayRepository.upsertRoute({
      routeId: "route_planner_v1",
      pathPattern: "/api/v1/planner/*",
      targetServiceId: "srv_planner_service",
      apiVersion: "v1",
      methods: ["GET", "POST"],
      enabled: true,
      rateLimitPerMin: 120,
      authRequired: true,
    });

    await gatewayRepository.upsertPolicy({
      policyId: "policy_global_default",
      scope: GatewayPolicyScopeEnum.GLOBAL,
      rateLimitPerMin: 120,
      burstLimit: 200,
      cacheEnabled: true,
      cacheTtlSeconds: 300,
    });

    logger.info("✅ API Gateway seed completed successfully");
  } catch (err: any) {
    logger.warn(`⚠️ Gateway seeder warning: ${err.message}`);
  }
}
