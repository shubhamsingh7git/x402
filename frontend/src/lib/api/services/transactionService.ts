import { apiClient } from "../axios";
import { ApiResponse, Transaction, PaginatedResponse } from "@/types";

export interface TransactionFilterParams {
  search?: string;
  merchant?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const transactionService = {
  listTransactions: async (params?: TransactionFilterParams): Promise<PaginatedResponse<Transaction>> => {
    const res = await apiClient.get("/transactions", { params });
    const payload = res.data;
    const inner = payload?.data || payload;
    const rows = Array.isArray(inner?.data)
      ? inner.data
      : Array.isArray(inner?.transactions)
      ? inner.transactions
      : Array.isArray(inner)
      ? inner
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    const pagination = inner?.pagination || payload?.pagination || { page: 1, limit: 10, total: rows.length, totalPages: 1 };
    return { success: true, data: rows, pagination };
  },

  getTransactionDetails: async (id: string): Promise<Transaction> => {
    const res = await apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return res.data?.data || res.data;
  },
};
