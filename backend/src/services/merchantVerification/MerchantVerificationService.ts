import mongoose from "mongoose";
import { Merchant, IMerchantDocument } from "../../models/Merchant";
import { MERCHANT_STATUS, MerchantStatus } from "../../constants/status";
import { env } from "../../config/env";
import { strategyRegistry } from "./registry/MerchantVerificationStrategyRegistry";
import { WalletVerificationStrategy } from "./strategies/WalletVerificationStrategy";
import { NetworkVerificationStrategy } from "./strategies/NetworkVerificationStrategy";
import { PolicyVerificationStrategy } from "./strategies/PolicyVerificationStrategy";
import { ApiServiceVerificationStrategy } from "./strategies/ApiServiceVerificationStrategy";
import { FacilitatorVerificationStrategy } from "./strategies/FacilitatorVerificationStrategy";
import { MerchantVerificationContext } from "./MerchantVerificationContext";
import { MerchantVerificationResult, StrategyResult } from "./MerchantVerificationResult";
import { merchantVerificationLogRepository } from "../../repositories/merchantVerificationLog.repository";
import { eventBus } from "../../events/eventBus";
import { logger } from "../../utils/logger";
import { AuditLog } from "../../models/AuditLog";
import { TimelineEvent } from "../../models/TimelineEvent";
import { TIMELINE_EVENTS } from "../../constants/events";

export class MerchantVerificationService {
  constructor() {
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies(): void {
    strategyRegistry.register(new WalletVerificationStrategy());
    strategyRegistry.register(new NetworkVerificationStrategy());
    strategyRegistry.register(new PolicyVerificationStrategy());
    strategyRegistry.register(new ApiServiceVerificationStrategy());
    strategyRegistry.register(new FacilitatorVerificationStrategy());
  }

  async verifyMerchant(
    merchantIdentifier: string,
    forceRefresh = false
  ): Promise<MerchantVerificationResult> {
    const startTime = Date.now();
    let merchant: IMerchantDocument | null = null;

    if (mongoose.Types.ObjectId.isValid(merchantIdentifier)) {
      merchant = await Merchant.findById(merchantIdentifier);
    }
    if (!merchant) {
      merchant = await Merchant.findOne({ alias: merchantIdentifier, isDeleted: false });
    }

    if (!merchant) {
      throw new Error(`Merchant [${merchantIdentifier}] not found`);
    }

    const now = new Date();
    const statusBefore = merchant.status;

    // Check DB Expiry Cache
    if (
      !forceRefresh &&
      merchant.verificationExpiresAt &&
      merchant.verificationExpiresAt.getTime() > now.getTime() &&
      merchant.verificationStatus === "VALID" &&
      merchant.status === MERCHANT_STATUS.VERIFIED
    ) {
      logger.debug(`🔍 Returning cached verification status for merchant [${merchant.alias}]`);
      return this.buildResult(merchant, [], true, "Verification cached in database");
    }

    // Set status to VERIFYING
    if (merchant.status !== MERCHANT_STATUS.BLOCKED && merchant.status !== MERCHANT_STATUS.DELETED) {
      merchant.status = MERCHANT_STATUS.VERIFYING as MerchantStatus;
      await merchant.save();
    }

    eventBus.emitEvent("merchant:verificationStarted" as any, {
      merchantId: merchant._id.toString(),
      alias: merchant.alias,
      statusBefore,
    });

    const context: MerchantVerificationContext = {
      merchant,
      paymentMode: env.PAYMENT_MODE,
      network: merchant.network,
      timestamp: now,
    };

    const strategies = strategyRegistry.getStrategies();
    const results: StrategyResult[] = [];
    const warnings: string[] = [];

    for (const strategy of strategies) {
      try {
        const res = await strategy.execute(context);
        results.push(res);
        if (res.status === "FAIL" && res.reason) {
          warnings.push(`Strategy [${res.name}] failed: ${res.reason}`);
        }
      } catch (err: any) {
        results.push({
          name: strategy.name,
          status: "FAIL",
          reason: err.message || "Execution exception",
        });
        warnings.push(`Strategy [${strategy.name}] exception: ${err.message}`);
      }
    }

    const failedStrategies = results.filter((r) => r.status === "FAIL");
    const isVerified = failedStrategies.length === 0;

    let newStatus: MerchantStatus = merchant.status;
    let reason = "All verification strategies passed successfully";

    if (isVerified) {
      newStatus = MERCHANT_STATUS.VERIFIED as MerchantStatus;
    } else {
      reason = failedStrategies.map((f) => `${f.name}: ${f.reason}`).join("; ");
      if (merchant.status !== MERCHANT_STATUS.BLOCKED) {
        newStatus = MERCHANT_STATUS.SUSPENDED as MerchantStatus;
      }
    }

    const ttlMs = env.MERCHANT_VERIFICATION_TTL_MINUTES * 60 * 1000;
    const expiresAt = new Date(now.getTime() + ttlMs);

    merchant.status = newStatus;
    merchant.lastVerifiedAt = now;
    merchant.verificationExpiresAt = expiresAt;
    merchant.verificationStatus = isVerified ? "VALID" : "EXPIRED";
    merchant.verificationReason = reason;
    merchant.verificationVersion = (merchant.verificationVersion || 1);
    await merchant.save();

    const durationMs = Date.now() - startTime;

    // Create Audit Verification Log
    const strategiesResultsRecord: Record<string, StrategyResult> = {};
    for (const r of results) {
      strategiesResultsRecord[r.name] = r;
    }

    await merchantVerificationLogRepository.createLog({
      merchant: merchant._id as any,
      merchantAlias: merchant.alias,
      statusBefore,
      statusAfter: newStatus,
      reason,
      checkedAt: now,
      durationMs,
      performedBy: "MerchantVerificationService",
      strategiesResults: strategiesResultsRecord,
      verificationVersion: merchant.verificationVersion,
    });

    // Create AuditLog & TimelineEvent entries
    await AuditLog.create({
      action: "MERCHANT_VERIFICATION_COMPLETED",
      entityType: "Merchant",
      entityId: merchant._id.toString(),
      details: {
        merchantAlias: merchant.alias,
        statusBefore,
        statusAfter: newStatus,
        verified: isVerified,
        reason,
        durationMs,
      },
    });

    await TimelineEvent.create({
      runId: `merchant_verif_${merchant._id}`,
      event: TIMELINE_EVENTS.MERCHANT_VERIFICATION_COMPLETED,
      timestamp: now,
      metadata: {
        merchantId: merchant._id.toString(),
        alias: merchant.alias,
        status: newStatus,
        verified: isVerified,
      },
    });

    // Emit EventBus events
    if (isVerified) {
      eventBus.emitEvent("merchant:verificationSucceeded" as any, {
        merchantId: merchant._id.toString(),
        alias: merchant.alias,
        status: newStatus,
      });
    } else {
      eventBus.emitEvent("merchant:verificationFailed" as any, {
        merchantId: merchant._id.toString(),
        alias: merchant.alias,
        status: newStatus,
        reason,
      });
    }

    if (statusBefore !== newStatus) {
      eventBus.emitEvent("merchant:statusChanged" as any, {
        merchantId: merchant._id.toString(),
        alias: merchant.alias,
        statusBefore,
        statusAfter: newStatus,
        reason,
      });
    }

    logger.info(`🛡️ Merchant [${merchant.alias}] verification completed. Status: ${newStatus} (Verified: ${isVerified}) in ${durationMs}ms`);

    return this.buildResult(merchant, results, isVerified, reason, warnings);
  }

  private buildResult(
    merchant: IMerchantDocument,
    strategyResults: StrategyResult[],
    verified: boolean,
    reason: string,
    warnings: string[] = []
  ): MerchantVerificationResult {
    const defaultResults: Record<string, "PASS" | "FAIL"> = {
      wallet: "PASS",
      network: "PASS",
      policy: "PASS",
      facilitator: "PASS",
      apiService: "PASS",
    };

    let passedCount = 0;
    let failedCount = 0;

    for (const sr of strategyResults) {
      defaultResults[sr.name] = sr.status;
      if (sr.status === "PASS") passedCount++;
      else failedCount++;
    }

    return {
      merchantId: merchant._id.toString(),
      verified,
      status: merchant.status,
      checkedAt: merchant.lastVerifiedAt || new Date(),
      expiresAt: merchant.verificationExpiresAt || new Date(),
      reason,
      warnings,
      verificationResults: defaultResults as any,
      verificationSummary: {
        passedStrategies: passedCount || (verified ? 5 : 0),
        failedStrategies: failedCount || (verified ? 0 : 1),
        warnings: warnings.length,
      },
      verificationVersion: merchant.verificationVersion || 1,
      merchantSnapshot: {
        alias: merchant.alias,
        walletAddress: merchant.walletAddress,
        network: merchant.network,
        status: merchant.status,
      },
    };
  }
}

export const merchantVerificationService = new MerchantVerificationService();
