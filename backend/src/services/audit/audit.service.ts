import { auditLogRepository } from "../../repositories/auditLog.repository";
import { ApiError } from "../../utils/ApiError";
import { ParsedQueryParams, PaginatedResult } from "../../utils/query.util";
import { IAuditLog } from "../../interfaces/transaction.interface";

export class AuditService {
  async getAuditLogs(params: ParsedQueryParams): Promise<PaginatedResult<IAuditLog>> {
    const { data, total } = await auditLogRepository.findPaginated(
      params.filter,
      params.skip,
      params.limit,
      params.sort
    );
    const pages = Math.ceil(total / params.limit) || 1;
    return {
      data: data as unknown as IAuditLog[],
      pagination: { total, page: params.page, limit: params.limit, pages },
    };
  }

  async getAuditLogById(id: string): Promise<IAuditLog> {
    const log = await auditLogRepository.findById(id);
    if (!log) {
      throw ApiError.notFound("Audit log entry not found");
    }
    return log as unknown as IAuditLog;
  }

  async createLog(
    action: string,
    metadata: Record<string, unknown>,
    userId?: string,
    requestId?: string,
    ip?: string,
    userAgent?: string
  ) {
    return auditLogRepository.create({
      action,
      metadata,
      user: userId as any,
      requestId,
      ip,
      userAgent,
    });
  }
}

export const auditService = new AuditService();
