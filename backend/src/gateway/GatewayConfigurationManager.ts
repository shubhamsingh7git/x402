import { gatewayCache } from "./GatewayCache";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class GatewayConfigurationManager {
  async hotReload(): Promise<boolean> {
    gatewayCache.clear();
    logger.info("🔥 GatewayConfigurationManager performed zero-downtime hot reload");
    eventBus.emitEvent("gateway:routeReloaded" as any, { reloadedAt: new Date() });
    return true;
  }
}

export const gatewayConfigurationManager = new GatewayConfigurationManager();
