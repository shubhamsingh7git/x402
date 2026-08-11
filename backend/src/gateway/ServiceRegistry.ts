import { serviceRegistryRepository } from "../repositories/ServiceRegistryRepository";
import { ServiceHealthEnum } from "./GatewayStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class ServiceRegistry {
  async registerService(serviceName: string, targetUrl: string, version = "v1") {
    const serviceId = `srv_${serviceName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    const service = await serviceRegistryRepository.upsert({
      serviceId,
      serviceName,
      targetUrl,
      version,
      status: ServiceHealthEnum.HEALTHY,
      latencyMs: 12,
      lastHealthCheck: new Date(),
      weight: 100,
    });

    logger.info(`🌐 ServiceRegistry registered microservice '${serviceName}' [${serviceId}] (${targetUrl})`);
    eventBus.emitEvent("gateway:serviceRegistered" as any, service as any);
    return service;
  }

  async getServices() {
    return serviceRegistryRepository.find(50);
  }
}

export const serviceRegistry = new ServiceRegistry();
