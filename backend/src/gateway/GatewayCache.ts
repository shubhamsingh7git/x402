import { logger } from "../utils/logger";

export class GatewayCache {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();

  set(key: string, value: any, ttlSeconds = 300): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  clear(): void {
    this.cache.clear();
    logger.info("🧹 GatewayCache cleared completely");
  }
}

export const gatewayCache = new GatewayCache();
