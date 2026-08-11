import { Request, Response, NextFunction } from "express";
import { merchantService, RequestMetaContext } from "../services/merchant/merchant.service";
import { merchantVerificationService } from "../services/merchantVerification/MerchantVerificationService";
import { parseQueryParams } from "../utils/query.util";
import { ApiResponse } from "../utils/ApiResponse";

export class MerchantController {
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
      const params = parseQueryParams(req, ["alias", "walletAddress", "network", "status"]);
      const result = await merchantService.getMerchants(params);
      ApiResponse.ok(res, "Merchants retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const merchant = await merchantService.getMerchantById(id);
      ApiResponse.ok(res, "Merchant retrieved successfully", merchant);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = this.getMetaContext(req);
      const merchant = await merchantService.createMerchant(req.body, meta);
      ApiResponse.created(res, "Merchant created successfully", merchant);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMetaContext(req);
      const merchant = await merchantService.updateMerchant(id, req.body, meta);
      ApiResponse.ok(res, "Merchant updated successfully", merchant);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMetaContext(req);
      await merchantService.deleteMerchant(id, meta);
      ApiResponse.ok(res, "Merchant deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const force = req.query.force === "true";
      const result = await merchantVerificationService.verifyMerchant(id, force);
      ApiResponse.ok(res, "Merchant verification completed", result);
    } catch (error) {
      next(error);
    }
  }
}

export const merchantController = new MerchantController();
