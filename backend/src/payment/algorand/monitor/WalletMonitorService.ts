import { walletManager } from "../wallet/WalletManager";
import { goPlausibleFacilitatorProvider } from "../facilitator/GoPlausibleFacilitatorProvider";
import { eventBus } from "../../../events/eventBus";
import { logger } from "../../../utils/logger";

export class WalletMonitorService {
  private static instance: WalletMonitorService;
  private intervalTimer?: NodeJS.Timeout;

  private constructor() {}

  public static getInstance(): WalletMonitorService {
    if (!WalletMonitorService.instance) {
      WalletMonitorService.instance = new WalletMonitorService();
    }
    return WalletMonitorService.instance;
  }

  public startMonitoring(intervalMs = 30000): void {
    if (this.intervalTimer) return;

    logger.info(`🔍 WalletMonitorService started (Polling every ${intervalMs / 1000}s)`);
    this.checkHealth();

    this.intervalTimer = setInterval(() => {
      this.checkHealth().catch((err) => {
        logger.warn(`WalletMonitorService health check error: ${err.message}`);
      });
    }, intervalMs);
  }

  public stopMonitoring(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = undefined;
    }
  }

  public async checkHealth(): Promise<{ walletStatus: any; facilitatorStatus: string }> {
    const status = await walletManager.refreshStatus();

    eventBus.emitEvent("wallet:network" as any, { network: "algorand:testnet", status: "online" });
    eventBus.emitEvent("facilitator:connected" as any, { endpoint: goPlausibleFacilitatorProvider.endpoint });

    return {
      walletStatus: status,
      facilitatorStatus: "connected",
    };
  }
}

export const walletMonitorService = WalletMonitorService.getInstance();
