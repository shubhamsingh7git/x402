import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";
import { initializeSocket, closeSocket } from "./config/socket";
import { registerSocketHandlers } from "./socket";
import { merchantVerificationJob } from "./jobs/MerchantVerificationJob";
import { logger } from "./utils/logger";

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);
registerSocketHandlers();

let isShuttingDown = false;

// Graceful Shutdown Handler
const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  logger.info(`\n${signal} received. Initiating graceful shutdown...`);

  try {
    // 1. Stop background jobs
    merchantVerificationJob.stop();

    // 2. Close Socket.IO
    await closeSocket();

    // 3. Close HTTP Server
    if (server.listening) {
      await new Promise<void>((resolve) => {
        server.close((err) => {
          if (err) {
            logger.error({ err }, "Error closing HTTP server");
          } else {
            logger.info("✅ HTTP server closed gracefully");
          }
          resolve();
        });
      });
    }

    // 4. Disconnect MongoDB
    await disconnectDB();

    logger.info("👋 All resources cleaned up. Process exiting cleanly.");
    process.exit(signal === "EADDRINUSE" ? 1 : 0);
  } catch (error) {
    logger.error({ err: error }, "❌ Error during shutdown sequence");
    process.exit(1);
  }
};

// Handle EADDRINUSE and server startup errors cleanly
server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    logger.error(`❌ Port ${env.port} is already in use by another process.`);
    shutdown("EADDRINUSE");
  } else {
    logger.fatal({ err }, "❌ HTTP Server unexpected error");
    shutdown("SERVER_ERROR");
  }
});

// Start Server Bootstrap Sequence
const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed default Bazaar capabilities & providers if empty
    const { seedBazaarData } = await import("./seeders/bazaar.seeder");
    await seedBazaarData();

    // Seed default Marketplace profiles & SLA if empty
    const { seedMarketplaceData } = await import("./seeders/marketplace.seeder");
    await seedMarketplaceData();

    // Seed default Agent Platform specialized agents if empty
    const { seedAgentData } = await import("./seeders/agent.seeder");
    await seedAgentData();

    // Seed default Enterprise Intelligence graph & memory if empty
    const { seedIntelligenceData } = await import("./seeders/intelligence.seeder");
    await seedIntelligenceData();

    // Seed default Enterprise Control Plane hierarchy & policies if empty
    const { seedControlPlaneData } = await import("./seeders/controlplane.seeder");
    await seedControlPlaneData();

    // Seed default Distributed Infrastructure queues & workers if empty
    const { seedDistributedData } = await import("./seeders/distributed.seeder");
    await seedDistributedData();

    // Seed default API Gateway microservices & policies if empty
    const { seedGatewayData } = await import("./seeders/gateway.seeder");
    await seedGatewayData();

    // Seed default Observability traces, alerts & incidents if empty
    const { seedObservabilityData } = await import("./seeders/observability.seeder");
    await seedObservabilityData();

    // Seed default Enterprise Security identities, policies & compliance if empty
    const { seedSecurityData } = await import("./seeders/security.seeder");
    await seedSecurityData();

    // Seed default DevOps clusters, pipelines, GitOps & HPA if empty
    const { seedDevOpsData } = await import("./seeders/devops.seeder");
    await seedDevOpsData();

    // Seed default Enterprise Production HA, DR, Chaos & Runbooks if empty
    const { seedProductionData } = await import("./seeders/production.seeder");
    await seedProductionData();

    // Bind HTTP Server to Port
    server.listen(env.port, () => {
      logger.info(`🚀 x402 Backend running on http://localhost:${env.port}`);
      logger.info(`📚 API Docs at http://localhost:${env.port}/docs`);
      logger.info(`🏥 Health check at http://localhost:${env.port}/api/v1/health`);
      logger.info(`🌍 Environment: ${env.nodeEnv}`);
    });

    // Start Background Jobs
    merchantVerificationJob.start();
  } catch (error) {
    logger.fatal({ err: error }, "❌ Failed to start server bootstrap");
    await shutdown("BOOTSTRAP_FAILURE");
  }
};

// Process Signal Listeners
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGUSR2", () => shutdown("SIGUSR2")); // Hot reload signal for nodemon/ts-node-dev

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled Rejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught Exception");
  shutdown("UNCAUGHT_EXCEPTION");
});

start();
