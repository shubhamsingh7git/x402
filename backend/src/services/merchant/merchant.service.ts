import { merchantRepository } from "../../repositories/merchant.repository";
import { auditLogRepository } from "../../repositories/auditLog.repository";
import { analyticsService } from "../analytics/analytics.service";
import { eventBus } from "../../events/eventBus";
import { EVENTS } from "../../constants/events";
import { MERCHANT_STATUS } from "../../constants/status";
import { ApiError } from "../../utils/ApiError";
import { ParsedQueryParams, PaginatedResult } from "../../utils/query.util";
import { IMerchantCreatePayload, IMerchantUpdatePayload, IMerchant } from "../../interfaces/policy.interface";

export interface RequestMetaContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
}

export class MerchantService {
  async getMerchants(params: ParsedQueryParams): Promise<PaginatedResult<IMerchant>> {
    const { data, total } = await merchantRepository.findPaginated(
      params.filter,
      params.skip,
      params.limit,
      params.sort
    );
    const pages = Math.ceil(total / params.limit) || 1;
    return {
      data: data as unknown as IMerchant[],
      pagination: { total, page: params.page, limit: params.limit, pages },
    };
  }

  async getMerchantById(id: string): Promise<IMerchant> {
    const merchant = await merchantRepository.findById(id);
    if (!merchant) {
      throw ApiError.notFound("Merchant not found");
    }
    return merchant as unknown as IMerchant;
  }

  async createMerchant(data: IMerchantCreatePayload, meta?: RequestMetaContext): Promise<IMerchant> {
    const existing = await merchantRepository.findByWalletAddress(data.walletAddress);
    if (existing) {
      throw ApiError.conflict("Merchant with this wallet address already exists");
    }

    const merchant = await merchantRepository.create({
      alias: data.alias,
      walletAddress: data.walletAddress,
      address: data.walletAddress,
      network: data.network,
      status: MERCHANT_STATUS.PENDING as any,
      verificationStatus: "PENDING",
      addedAt: new Date(),
    });

    // Create Audit Log
    await auditLogRepository.create({
      action: "MERCHANT_CREATED",
      user: meta?.userId as any,
      requestId: meta?.requestId,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      metadata: { merchantId: merchant._id, alias: merchant.alias, walletAddress: merchant.walletAddress },
    });

    analyticsService.invalidateCache();
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "MERCHANT_CREATED", merchantId: merchant._id });
    eventBus.emitEvent("merchant:created" as any, { merchant });
    eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "merchant_created" });

    return merchant as unknown as IMerchant;
  }

  async updateMerchant(id: string, data: IMerchantUpdatePayload, meta?: RequestMetaContext): Promise<IMerchant> {
    const merchant = await merchantRepository.findById(id);
    if (!merchant) {
      throw ApiError.notFound("Merchant not found");
    }

    const updated = await merchantRepository.updateById(id, data);

    // Create Audit Log
    await auditLogRepository.create({
      action: "MERCHANT_UPDATED",
      user: meta?.userId as any,
      requestId: meta?.requestId,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      metadata: { merchantId: id, updates: data },
    });

    analyticsService.invalidateCache();
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "MERCHANT_UPDATED", merchantId: id });
    eventBus.emitEvent("merchant:updated" as any, { merchant: updated });
    eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "merchant_updated" });

    return updated as unknown as IMerchant;
  }

  async deleteMerchant(id: string, meta?: RequestMetaContext): Promise<void> {
    const merchant = await merchantRepository.findById(id);
    if (!merchant) {
      throw ApiError.notFound("Merchant not found");
    }

    await merchantRepository.softDelete(id);

    // Create Audit Log
    await auditLogRepository.create({
      action: "MERCHANT_DELETED",
      user: meta?.userId as any,
      requestId: meta?.requestId,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      metadata: { merchantId: id, alias: merchant.alias },
    });

    analyticsService.invalidateCache();
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "MERCHANT_DELETED", merchantId: id });
    eventBus.emitEvent("merchant:deleted" as any, { merchantId: id });
    eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "merchant_deleted" });
  }
}

export const merchantService = new MerchantService();
