import { create } from "zustand";

export interface AppNotification {
  id: string;
  category: "Merchant" | "Payment" | "Research" | "Planner" | "Execution" | "Bazaar" | "Marketplace" | "Wallet" | "Protocol" | "System";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  metadata?: Record<string, any>;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "init_1",
      category: "System",
      title: "System Booted",
      message: "x402 Commerce Backend connected via Socket.IO.",
      timestamp: new Date().toISOString(),
      read: false,
      type: "info",
    },
  ],
  unreadCount: 1,

  addNotification: (item) => {
    const newNotif: AppNotification = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
