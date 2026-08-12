import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./env";
import { logger } from "../utils/logger";

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HttpServer): SocketIOServer => {
  if (io) {
    logger.debug("⚡ Socket.IO already initialized. Reusing existing instance.");
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || origin === env.clientUrl || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Main namespace connection
  io.on("connection", (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      logger.info(`🔌 Socket disconnected: ${socket.id} — ${reason}`);
    });
  });

  // /agent namespace for real-time agent execution events
  const agentNamespace = io.of("/agent");

  agentNamespace.on("connection", (socket) => {
    logger.info(`🤖 Agent socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      logger.info(`🤖 Agent socket disconnected: ${socket.id} — ${reason}`);
    });
  });

  logger.info("✅ Socket.IO initialized with /agent namespace");

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initializeSocket first.");
  }
  return io;
};

export const closeSocket = async (): Promise<void> => {
  if (io) {
    await new Promise<void>((resolve) => {
      (io as SocketIOServer).close(() => {
        logger.info("Socket.IO closed gracefully");
        io = null;
        resolve();
      });
    });
  }
};
