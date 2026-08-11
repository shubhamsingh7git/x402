import { Merchant } from "../models/Merchant";
import { MERCHANT_STATUS } from "../constants/status";
import { merchantVerificationService } from "../services/merchantVerification/MerchantVerificationService";
import { logger } from "../utils/logger";

export class MerchantVerificationJob {
  private timer: NodeJS.Timeout | null = null;
  private isJobExecuting = false;

  start(intervalMs = 5 * 60 * 1000): void {
    if (this.timer !== null) {
      logger.debug("⏰ MerchantVerificationJob timer is already active. Skipping duplicate start.");
      return;
    }
    logger.info(`⏰ MerchantVerificationJob scheduled to run every ${intervalMs / 1000} seconds`);
    this.timer = setInterval(() => this.runJob(), intervalMs);
    // Initial run on startup
    this.runJob().catch((err) => logger.error("❌ Exception during initial MerchantVerificationJob run:", err));
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
      logger.info("⏹️ MerchantVerificationJob stopped");
    }
  }

  isRunning(): boolean {
    return this.isJobExecuting || this.timer !== null;
  }

  async runJob(): Promise<void> {
    if (this.isJobExecuting) {
      return;
    }
    this.isJobExecuting = true;
    const startTime = Date.now();

    try {
      const now = new Date();
      const expiredMerchants = await Merchant.find({
        isDeleted: false,
        $or: [
          { verificationExpiresAt: { $lte: now } },
          { status: MERCHANT_STATUS.PENDING },
          { verificationStatus: "EXPIRED" },
        ],
      });

      if (expiredMerchants.length === 0) {
        logger.debug("⏰ MerchantVerificationJob: No expired or pending merchants to verify");
        return;
      }

      logger.info(`⏰ MerchantVerificationJob: Found ${expiredMerchants.length} merchants requiring re-verification`);

      for (const m of expiredMerchants) {
        try {
          await merchantVerificationService.verifyMerchant(m._id.toString(), true);
        } catch (err: any) {
          logger.error(`❌ MerchantVerificationJob failed to verify merchant [${m.alias}]:`, err.message);
        }
      }

      const durationMs = Date.now() - startTime;
      logger.info(`✅ MerchantVerificationJob completed batch verification in ${durationMs}ms`);
    } catch (err: any) {
      logger.error("❌ Exception during MerchantVerificationJob execution:", err);
    } finally {
      this.isJobExecuting = false;
    }
  }
}

export const merchantVerificationJob = new MerchantVerificationJob();
