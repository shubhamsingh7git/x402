import { io, Socket } from "socket.io-client";
import { queryClient } from "./queryClient";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

declare global {
  var __x402_socket: Socket | undefined;
}

export type SocketStatus = "connected" | "reconnecting" | "offline";

export const getSocket = (): Socket => {
  if (typeof window === "undefined") {
    return null as unknown as Socket;
  }

  if (!globalThis.__x402_socket) {
    const instance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    instance.on("connect", () => {
      // Connection established
    });

    instance.on("disconnect", () => {
      // Connection lost
    });

    // Remove old listeners to prevent duplicates
    instance.off("dashboard:update");
    instance.off("dashboard:refresh");
    instance.off("merchant:created");
    instance.off("merchant:verificationSucceeded");
    instance.off("merchant:verificationFailed");
    instance.off("payment:completed");
    instance.off("transaction:added");

    // Debounce query invalidations to prevent rapid render spikes from high-frequency socket events
    const invalidationTimers: Record<string, NodeJS.Timeout> = {};
    const debouncedInvalidate = (key: string) => {
      if (invalidationTimers[key]) {
        clearTimeout(invalidationTimers[key]);
      }
      invalidationTimers[key] = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [key] });
      }, 100);
    };

    // Cache invalidation listeners
    instance.on("dashboard:update", () => {
      debouncedInvalidate("dashboard");
      debouncedInvalidate("analytics");
    });

    instance.on("dashboard:refresh", () => {
      debouncedInvalidate("dashboard");
      debouncedInvalidate("analytics");
    });

    instance.on("merchant:created", () => {
      debouncedInvalidate("merchants");
      debouncedInvalidate("dashboard");
    });

    instance.on("merchant:verificationSucceeded", () => {
      debouncedInvalidate("merchants");
      debouncedInvalidate("dashboard");
    });

    instance.on("merchant:verificationFailed", () => {
      debouncedInvalidate("merchants");
      debouncedInvalidate("dashboard");
    });

    instance.on("payment:completed", () => {
      debouncedInvalidate("transactions");
      debouncedInvalidate("dashboard");
      debouncedInvalidate("analytics");
    });

    instance.on("transaction:added", () => {
      debouncedInvalidate("transactions");
      debouncedInvalidate("dashboard");
    });

    globalThis.__x402_socket = instance;
  }

  return globalThis.__x402_socket;
};
