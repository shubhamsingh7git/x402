import { bazaarRegistry } from "./BazaarRegistry";
import { bazaarSearch } from "./BazaarSearch";
import { bazaarRanking } from "./BazaarRanking";
import { providerResolver } from "./ProviderResolver";
import { capabilityResolver } from "./CapabilityResolver";
import { eventBus } from "../events/eventBus";
import { BAZAAR_EVENTS } from "./BazaarEvents";
import { auditLogRepository } from "../repositories/auditLog.repository";
import { IBazaarSearchParams, IBazaarOverviewMetrics } from "./BazaarTypes";
import { IProviderListing } from "../models/ProviderListing.model";
import { ICapability } from "../models/Capability.model";

export class BazaarService {
  async registerProvider(payload: Partial<IProviderListing>, meta?: any): Promise<IProviderListing> {
    const listing = await bazaarRegistry.registerProvider(payload);

    // Audit log
    await auditLogRepository.create({
      action: "BAZAAR_PROVIDER_CREATED" as any,
      user: meta?.userId,
      ip: meta?.ip || "127.0.0.1",
      userAgent: meta?.userAgent || "BazaarEngine/1.0",
      metadata: {
        providerId: listing.providerId,
        merchantId: listing.merchantId?.toString(),
        capabilities: listing.capabilities,
        pricePerCall: listing.pricePerCall,
      },
    });

    // EventBus broadcast
    eventBus.emitEvent(BAZAAR_EVENTS.PROVIDER_CREATED as any, {
      providerId: listing.providerId,
      merchantId: listing.merchantId,
      capabilities: listing.capabilities,
    });

    return listing;
  }

  async updateProvider(id: string, payload: Partial<IProviderListing>, meta?: any): Promise<IProviderListing | null> {
    const updated = await bazaarRegistry.updateProvider(id, payload);
    if (updated) {
      await auditLogRepository.create({
        action: "BAZAAR_PROVIDER_UPDATED" as any,
        user: meta?.userId,
        ip: meta?.ip || "127.0.0.1",
        userAgent: meta?.userAgent || "BazaarEngine/1.0",
        metadata: { providerId: updated.providerId, merchantId: updated.merchantId?.toString(), changes: payload },
      });

      eventBus.emitEvent(BAZAAR_EVENTS.PROVIDER_UPDATED as any, {
        providerId: updated.providerId,
        merchantId: updated.merchantId,
        status: updated.status,
      });
    }
    return updated;
  }

  async removeProvider(id: string, meta?: any): Promise<boolean> {
    const existing = await bazaarRegistry.getProviderById(id);
    const removed = await bazaarRegistry.removeProvider(id);
    if (removed && existing) {
      await auditLogRepository.create({
        action: "BAZAAR_PROVIDER_DELETED" as any,
        user: meta?.userId,
        ip: meta?.ip || "127.0.0.1",
        userAgent: meta?.userAgent || "BazaarEngine/1.0",
        metadata: { providerId: existing.providerId, merchantId: existing.merchantId?.toString() },
      });

      eventBus.emitEvent(BAZAAR_EVENTS.PROVIDER_REMOVED as any, {
        providerId: existing.providerId,
        id,
      });
    }
    return removed;
  }

  async getProviderById(id: string): Promise<any | null> {
    const doc = await bazaarRegistry.getProviderById(id);
    if (!doc) return null;
    return providerResolver.resolveProviderWithTelemetry(doc.providerId);
  }

  async listProviders(filters?: any) {
    return bazaarRegistry.listProviders(filters);
  }

  async registerCapability(payload: Partial<ICapability>): Promise<ICapability> {
    const cap = await bazaarRegistry.registerCapability(payload);
    eventBus.emitEvent(BAZAAR_EVENTS.CAPABILITY_CREATED as any, { name: cap.name });
    return cap;
  }

  async listCapabilities(category?: string): Promise<ICapability[]> {
    return bazaarRegistry.listCapabilities(category);
  }

  async resolveCapabilityDetails(name: string) {
    return capabilityResolver.resolveCapabilityWithProviders(name);
  }

  async searchAndRank(params: IBazaarSearchParams, meta?: any) {
    const rawListings = await bazaarSearch.filterCandidates(params);
    const ranked = bazaarRanking.scoreAndRank(rawListings, params);

    // Audit log search action if query specified
    if (params.capability || params.search) {
      await auditLogRepository.create({
        action: "BAZAAR_SEARCH_PERFORMED" as any,
        user: meta?.userId,
        ip: meta?.ip || "127.0.0.1",
        userAgent: meta?.userAgent || "BazaarEngine/1.0",
        metadata: {
          capability: params.capability,
          resultsCount: ranked.length,
          topProvider: ranked[0]?.listing?.providerId || null,
        },
      });
    }

    return {
      success: true,
      query: params,
      total: ranked.length,
      candidates: ranked,
    };
  }

  async getOverviewMetrics(): Promise<IBazaarOverviewMetrics> {
    const res = await bazaarRegistry.listProviders({ limit: 100 });
    const allProviders = res.data;
    const capabilities = await bazaarRegistry.listCapabilities();

    const healthyCount = allProviders.filter((p) => p.status === "ACTIVE" && p.availability).length;
    const offlineCount = allProviders.length - healthyCount;

    const ranked = bazaarRanking.scoreAndRank(allProviders);
    const avgTrust = ranked.length
      ? Number((ranked.reduce((acc, curr) => acc + curr.metrics.trustScore, 0) / ranked.length).toFixed(1))
      : 98.0;

    const avgLatency = ranked.length
      ? Math.round(ranked.reduce((acc, curr) => acc + curr.metrics.latencyMs, 0) / ranked.length)
      : 120;

    return {
      totalProviders: res.total,
      healthyProviders: healthyCount,
      offlineProviders: offlineCount,
      activeCapabilities: capabilities.length,
      averageTrustScore: avgTrust,
      averageLatencyMs: avgLatency,
      latestActivity: {
        action: "BAZAAR_METRICS_COMPUTED",
        timestamp: new Date(),
      },
    };
  }
}

export const bazaarService = new BazaarService();
