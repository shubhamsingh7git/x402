import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";
import { env } from "../config/env";
import { walletManager } from "../payment/algorand/wallet/WalletManager";
import { goPlausibleFacilitatorProvider } from "../payment/algorand/facilitator/GoPlausibleFacilitatorProvider";
import { geminiProvider } from "../providers/gemini/GeminiProvider";
import { Merchant } from "../models/Merchant";
import { MERCHANT_STATUS } from "../constants/status";

export class HealthController {
  async check(_req: Request, res: Response): Promise<void> {
    const dbState = mongoose.connection.readyState;
    const dbStatus =
      dbState === 1 ? "connected" :
      dbState === 2 ? "connecting" :
      dbState === 3 ? "disconnecting" : "disconnected";

    const walletStatus = walletManager.getStatus();

    let merchantTelemetry = {
      verified: 0,
      pending: 0,
      suspended: 0,
      blocked: 0,
      expired: 0,
    };

    if (dbState === 1) {
      const now = new Date();
      const [verified, pending, suspended, blocked, expired] = await Promise.all([
        Merchant.countDocuments({ status: MERCHANT_STATUS.VERIFIED, isDeleted: false }),
        Merchant.countDocuments({ status: MERCHANT_STATUS.PENDING, isDeleted: false }),
        Merchant.countDocuments({ status: MERCHANT_STATUS.SUSPENDED, isDeleted: false }),
        Merchant.countDocuments({ status: MERCHANT_STATUS.BLOCKED, isDeleted: false }),
        Merchant.countDocuments({ verificationExpiresAt: { $lte: now }, isDeleted: false }),
      ]);
      merchantTelemetry = { verified, pending, suspended, blocked, expired };
    }

    ApiResponse.ok(res, "System health report generated", {
      status: dbState === 1 ? "OK" : "DEGRADED",
      version: "1.0.0-rc1.1",
      environment: env.NODE_ENV,
      serverTime: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      merchantVerification: merchantTelemetry,
      subsystems: {
        database: {
          status: dbStatus,
          host: mongoose.connection.host || "unknown",
        },
        ai: {
          provider: "Gemini",
          model: geminiProvider.getModelName(),
          status: env.GEMINI_API_KEY ? "active" : "fallback_mode",
        },
        paymentSystem: {
          mode: env.PAYMENT_MODE,
          defaultAsset: env.PAYMENT_DEFAULT_ASSET,
          defaultNetwork: env.PAYMENT_DEFAULT_NETWORK,
        },
        algorandWallet: {
          initialized: walletStatus.initialized,
          address: walletStatus.maskedAddress,
          network: walletStatus.network,
          algoBalance: walletStatus.algoBalance,
          usdcBalance: walletStatus.usdcBalance,
        },
        facilitator: {
          endpoint: goPlausibleFacilitatorProvider.endpoint,
          status: "connected",
        },
        messaging: {
          eventBus: "active",
          socketIO: "active",
        },
      },
    });
  }

  async liveness(_req: Request, res: Response): Promise<void> {
    ApiResponse.ok(res, "Server is alive", {
      status: "alive",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }

  async readiness(_req: Request, res: Response): Promise<void> {
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1;
    const walletStatus = walletManager.getStatus();

    const report = {
      status: isDbConnected ? "ready" : "not_ready",
      database: isDbConnected ? "connected" : "disconnected",
      eventBus: "active",
      socketIO: "active",
      gemini: env.GEMINI_API_KEY ? "active" : "fallback_mode",
      wallet: env.PAYMENT_MODE === "demo" ? "demo mode" : walletStatus.initialized ? "initialized" : "uninitialized",
      paymentMode: env.PAYMENT_MODE,
      facilitator: env.X402_FACILITATOR_URL ? "available" : "not_configured",
    };

    if (!isDbConnected) {
      ApiResponse.error(res, 503, "Server is not ready", ["MongoDB connection state is disconnected"]);
      return;
    }

    ApiResponse.ok(res, "Server is ready", report);
  }
}

export const healthController = new HealthController();
