import { serviceRegistryRepository } from "../repositories/ServiceRegistryRepository";
import { ServiceHealthEnum } from "./GatewayStatus";
import { logger } from "../utils/logger";

export class ServiceDiscovery {
  async discoverService(serviceName: string) {
    const services = await serviceRegistryRepository.find(50);
    const matched = services.filter((s) => s.serviceName === serviceName && s.status === ServiceHealthEnum.HEALTHY);
    
    if (matched.length === 0) {
      logger.warn(`⚠️ ServiceDiscovery: No healthy instance found for service '${serviceName}'`);
      return null;
    }

    logger.debug(`🔍 ServiceDiscovery resolved service '${serviceName}' → ${matched[0].targetUrl}`);
    return matched[0];
  }
}

export const serviceDiscovery = new ServiceDiscovery();
