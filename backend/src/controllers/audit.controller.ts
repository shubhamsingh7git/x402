import { Request, Response, NextFunction } from "express";
import { auditService } from "../services/audit/audit.service";
import { parseQueryParams } from "../utils/query.util";
import { ApiResponse } from "../utils/ApiResponse";

export class AuditController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = parseQueryParams(req, ["action", "requestId", "ip"]);
      const result = await auditService.getAuditLogs(params);
      ApiResponse.ok(res, "Audit logs retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const log = await auditService.getAuditLogById(id);
      ApiResponse.ok(res, "Audit log retrieved successfully", log);
    } catch (error) {
      next(error);
    }
  }
}

export const auditController = new AuditController();
