import { algorandWalletProvider, AlgorandWalletProvider } from "./AlgorandWalletProvider";
import { eventBus } from "../../../events/eventBus";
import { logger } from "../../../utils/logger";

export interface WalletStatus {
  initialized: boolean;
  address: string;
  maskedAddress: string;
  network: string;
  algoBalance: number;
  usdcBalance: number;
  lastRefreshedAt: Date;
}

export class WalletManager {
  private static instance: WalletManager;
  private walletProvider: AlgorandWalletProvider;
  private initialized = false;
  private cachedStatus?: WalletStatus;

  private constructor() {
    this.walletProvider = algorandWalletProvider;
    this.initializeWallet();
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async initializeWallet(): Promise<void> {
    try {
      this.initialized = true;
      const status = await this.refreshStatus();
      logger.info(`⚡ WalletManager initialized. Active Address: ${status.maskedAddress}`);
      eventBus.emitEvent("wallet:connected" as any, { status });
    } catch (err: any) {
      this.initialized = false;
      logger.error({ err }, "WalletManager initialization failed");
      eventBus.emitEvent("wallet:error" as any, { error: err.message });
    }
  }

  public async refreshStatus(): Promise<WalletStatus> {
    const balances = await this.walletProvider.getBalances();
    const status: WalletStatus = {
      initialized: this.initialized,
      address: balances.address,
      maskedAddress: this.walletProvider.getMaskedAddress(),
      network: "algorand:testnet",
      algoBalance: balances.algoBalance,
      usdcBalance: balances.usdcBalance,
      lastRefreshedAt: new Date(),
    };
    this.cachedStatus = status;
    eventBus.emitEvent("wallet:balance" as any, { status });
    return status;
  }

  public getStatus(): WalletStatus {
    if (!this.cachedStatus) {
      return {
        initialized: this.initialized,
        address: this.walletProvider.getAddress(),
        maskedAddress: this.walletProvider.getMaskedAddress(),
        network: "algorand:testnet",
        algoBalance: 10.0,
        usdcBalance: 100.0,
        lastRefreshedAt: new Date(),
      };
    }
    return this.cachedStatus;
  }

  public getWalletProvider(): AlgorandWalletProvider {
    return this.walletProvider;
  }
}

export const walletManager = WalletManager.getInstance();
