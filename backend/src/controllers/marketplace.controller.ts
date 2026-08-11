import { Request, Response, NextFunction } from "express";
import { marketplaceService } from "../marketplace/MarketplaceService";
import { ApiResponse } from "../utils/ApiResponse";
import { MarketplaceStatusEnum } from "../marketplace/MarketplaceStatus";

export class MarketplaceController {
  private getMeta(req: Request) {
    return {
      userId: req.user?.userId,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };
  }

  async searchProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string;
      const capability = req.query.capability as string;
      const q = req.query.q as string;
      const status = req.query.status as string;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = req.query.skip ? Number(req.query.skip) : 0;

      const result = await marketplaceService.searchProviders({ category, capability, q, status, limit, skip });
      ApiResponse.ok(res, "Marketplace providers retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getProviderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const details = await marketplaceService.getProviderById(id);
      if (!details) {
        ApiResponse.error(res, 404, "Marketplace provider not found");
        return;
      }
      ApiResponse.ok(res, "Marketplace provider details retrieved successfully", details);
    } catch (error) {
      next(error);
    }
  }

  async createProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = this.getMeta(req);
      const profile = await marketplaceService.createProviderProfile(req.body, meta);
      ApiResponse.created(res, "Marketplace provider profile created successfully", profile);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const meta = this.getMeta(req);

      if (!status || !Object.values(MarketplaceStatusEnum).includes(status)) {
        ApiResponse.error(res, 400, "Invalid or missing marketplace status enum");
        return;
      }

      const updated = await marketplaceService.updateProviderStatus(id, status, meta);
      ApiResponse.ok(res, "Marketplace provider status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async addReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { providerId, rating, title, comment } = req.body;
      const meta = this.getMeta(req);

      if (!providerId || !rating || !title || !comment) {
        ApiResponse.error(res, 400, "Missing required review fields: providerId, rating, title, comment");
        return;
      }

      const review = await marketplaceService.addReview(providerId, { rating, title, comment }, meta);
      ApiResponse.created(res, "Marketplace review posted successfully", review);
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await marketplaceService.getAnalytics();
      ApiResponse.ok(res, "Marketplace analytics retrieved successfully", analytics);
    } catch (error) {
      next(error);
    }
  }
}

export const marketplaceController = new MarketplaceController();
