import { policyRepository } from "../../repositories/policy.repository";
import { merchantRepository } from "../../repositories/merchant.repository";
import { auditLogRepository } from "../../repositories/auditLog.repository";
import { analyticsService } from "../analytics/analytics.service";
import { eventBus } from "../../events/eventBus";
import { EVENTS } from "../../constants/events";
import { ApiError } from "../../utils/ApiError";
import { ParsedQueryParams, PaginatedResult } from "../../utils/query.util";
import { IPolicyCreatePayload, IPolicyUpdatePayload, IPolicy } from "../../interfaces/policy.interface";
import { RequestMetaContext } from "../merchant/merchant.service";

export class PolicyService {
  async getPolicies(params: ParsedQueryParams): Promise<PaginatedResult<IPolicy>> {
    const { data, total } = await policyRepository.findPaginated(
      params.filter,
      params.skip,
      params.limit,
      params.sort
    );
    const pages = Math.ceil(total / params.limit) || 1;
    return {
      data: data as unknown as IPolicy[],
      pagination: { total, page: params.page, limit: params.limit, pages },
    };
  }

  async getPolicyById(id: string): Promise<IPolicy> {
    const policy = await policyRepository.findById(id);
    if (!policy) {
      throw ApiError.notFound("Policy not found");
    }
    return policy as unknown as IPolicy;
  }

  async createPolicy(data: IPolicyCreatePayload, meta?: RequestMetaContext): Promise<IPolicy> {
    // 1. Check if merchant exists
    const merchant = await merchantRepository.findById(data.merchant);
    if (!merchant) {
      throw ApiError.notFound("Merchant does not exist");
    }

    // 2. Check if merchant already has a policy (only one policy per merchant)
    const existing = await policyRepository.findByMerchantId(data.merchant);
    if (existing) {
      throw ApiError.conflict("A policy already exists for this merchant");
    }

    // 3. Rule: dailyBudget >= transactionLimit
    if (data.dailyBudget < data.transactionLimit) {
      throw ApiError.badRequest("Daily budget must be greater than or equal to transaction limit");
    }

    const policy = await policyRepository.create({
      merchant: data.merchant as any,
      dailyBudget: data.dailyBudget,
      transactionLimit: data.transactionLimit,
      maxTransactionsPerMinute: data.maxTransactionsPerMinute || 30,
      killSwitch: data.killSwitch || false,
      enabled: data.enabled !== undefined ? data.enabled : true,
      version: 1,
      createdBy: meta?.userId || "System",
    });

    // Audit Log
    await auditLogRepository.create({
      action: "POLICY_CREATED",
      user: meta?.userId as any,
      requestId: meta?.requestId,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      metadata: { policyId: policy._id, merchantId: data.merchant, dailyBudget: data.dailyBudget, transactionLimit: data.transactionLimit },
    });

    analyticsService.invalidateCache();
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "POLICY_CREATED", policyId: policy._id });
    eventBus.emitEvent("policy:created" as any, { policy });
    eventBus.emitEvent(EVENTS.POLICY_UPDATED, { policyId: policy._id });
    eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "policy_created" });

    return policy as unknown as IPolicy;
  }

  async updatePolicy(id: string, data: IPolicyUpdatePayload, meta?: RequestMetaContext): Promise<IPolicy> {
    const current = await policyRepository.findById(id);
    if (!current) {
      throw ApiError.notFound("Policy not found");
    }

    const nextDailyBudget = data.dailyBudget !== undefined ? data.dailyBudget : current.dailyBudget;
    const nextTxLimit = data.transactionLimit !== undefined ? data.transactionLimit : current.transactionLimit;

    if (nextDailyBudget < nextTxLimit) {
      throw ApiError.badRequest("Daily budget must be greater than or equal to transaction limit");
    }

    const updated = await policyRepository.updateById(id, {
      ...data,
      version: current.version + 1,
      updatedBy: meta?.userId || "System",
    });

    // Audit Log
    await auditLogRepository.create({
      action: "POLICY_UPDATED",
      user: meta?.userId as any,
      requestId: meta?.requestId,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      metadata: { policyId: id, previousVersion: current.version, newVersion: (updated?.version || current.version + 1), updates: data },
    });

    analyticsService.invalidateCache();
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "POLICY_UPDATED", policyId: id });
    eventBus.emitEvent(EVENTS.POLICY_UPDATED, { policy: updated });
    eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "policy_updated" });

    return updated as unknown as IPolicy;
  }

  async deletePolicy(id: string, meta?: RequestMetaContext): Promise<void> {
    const policy = await policyRepository.findById(id);
    if (!policy) {
      throw ApiError.notFound("Policy not found");
    }

    await policyRepository.deleteById(id);

    // Audit Log
    await auditLogRepository.create({
      action: "POLICY_DELETED",
      user: meta?.userId as any,
      requestId: meta?.requestId,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      metadata: { policyId: id, merchantId: policy.merchant },
    });

    analyticsService.invalidateCache();
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "POLICY_DELETED", policyId: id });
    eventBus.emitEvent("policy:deleted" as any, { policyId: id });
    eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "policy_deleted" });
  }
}

export const policyService = new PolicyService();
