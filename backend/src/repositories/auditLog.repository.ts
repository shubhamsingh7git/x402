import { AuditLog, IAuditLogDocument } from "../models/AuditLog";

export class AuditLogRepository {
  async create(data: Partial<IAuditLogDocument>): Promise<IAuditLogDocument> {
    return AuditLog.create(data);
  }

  async findPaginated(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<{ data: IAuditLogDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      AuditLog.find(filter).populate("user", "name email role").sort(sort).skip(skip).limit(limit),
      AuditLog.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IAuditLogDocument | null> {
    return AuditLog.findById(id).populate("user", "name email role");
  }

  async countAll(): Promise<number> {
    return AuditLog.countDocuments();
  }
}

export const auditLogRepository = new AuditLogRepository();
