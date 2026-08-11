import { apiClient } from "../axios";
import { AuditLog, PaginatedResponse } from "@/types";

export interface AuditFilterParams {
  search?: string;
  action?: string;
  userId?: string;
  merchantId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const auditService = {
  listAuditLogs: async (params?: AuditFilterParams): Promise<PaginatedResponse<AuditLog>> => {
    const res = await apiClient.get("/audit", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const rows = Array.isArray(inner?.data)
      ? inner.data
      : Array.isArray(inner?.logs)
      ? inner.logs
      : Array.isArray(inner)
      ? inner
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    const pagination = inner?.pagination || payload?.pagination || { page: 1, limit: 15, total: rows.length, totalPages: 1 };
    return { success: true, data: rows, pagination };
  },
};
