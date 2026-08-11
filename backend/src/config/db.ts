import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export const connectDB = async (): Promise<typeof mongoose> => {
  const readyState = mongoose.connection.readyState;
  if (readyState === 1) {
    logger.debug(`✅ MongoDB connection active: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose;
  }
  if (readyState === 2) {
    logger.debug("⏳ MongoDB connection in progress...");
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(env.mongoUri, {
      dbName: "x402",
    });
    logger.info(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error({ err: error }, "⚠️ MongoDB connection failed");
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed gracefully");
    }
  } catch (error) {
    logger.error({ err: error }, "Error closing MongoDB connection");
  }
};

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "MongoDB connection error");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected. Attempting reconnect...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("✅ MongoDB reconnected");
});
