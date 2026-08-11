import { Request, Response, NextFunction } from "express";
import { policyService } from "../services/policy/policy.service";
import { parseQueryParams } from "../utils/query.util";
import { ApiResponse } from "../utils/ApiResponse";
import { RequestMetaContext } from "../services/merchant/merchant.service";

export class PolicyController {
  private getMetaContext(req: Request): RequestMetaContext {
    return {
      userId: req.user?.userId,
      requestId: req.requestId,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = parseQueryParams(req, ["merchant"]);
      const result = await policyService.getPolicies(params);
      ApiResponse.ok(res, "Policies retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const policy = await policyService.getPolicyById(id);
      ApiResponse.ok(res, "Policy retrieved successfully", policy);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = this.getMetaContext(req);
      const policy = await policyService.createPolicy(req.body, meta);
      ApiResponse.created(res, "Policy created successfully", policy);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMetaContext(req);
      const policy = await policyService.updatePolicy(id, req.body, meta);
      ApiResponse.ok(res, "Policy updated successfully", policy);
    } catch (error) {
      next(error);
    }
  }

  async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMetaContext(req);
      const { isEnabled } = req.body;
      const policy = await policyService.updatePolicy(id, { enabled: isEnabled }, meta);
      ApiResponse.ok(res, `Policy ${isEnabled ? "enabled" : "disabled"} successfully`, policy);
    } catch (error) {
      next(error);
    }
  }

  async toggleKillSwitch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMetaContext(req);
      const { killSwitch } = req.body;
      const policy = await policyService.updatePolicy(id, { killSwitch }, meta);
      ApiResponse.ok(res, `Kill switch ${killSwitch ? "ACTIVATED" : "deactivated"} successfully`, policy);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMetaContext(req);
      await policyService.deletePolicy(id, meta);
      ApiResponse.ok(res, "Policy deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}

export const policyController = new PolicyController();
