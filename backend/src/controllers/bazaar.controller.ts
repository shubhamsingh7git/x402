import { Request, Response, NextFunction } from "express";
import { bazaarService } from "../bazaar/BazaarService";
import { ApiResponse } from "../utils/ApiResponse";

export class BazaarController {
  private getMeta(req: Request) {
    return {
      userId: req.user?.userId,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };
  }

  async getProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        capability: req.query.capability as string,
        network: req.query.network as string,
        status: req.query.status as string,
        merchantId: req.query.merchantId as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const result = await bazaarService.listProviders(filters);
      ApiResponse.ok(res, "Bazaar providers retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getProviderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const provider = await bazaarService.getProviderById(id);
      if (!provider) {
        ApiResponse.error(res, 404, "Provider listing not found");
        return;
      }
      ApiResponse.ok(res, "Provider listing retrieved successfully", provider);
    } catch (error) {
      next(error);
    }
  }

  async createProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = this.getMeta(req);
      const provider = await bazaarService.registerProvider(req.body, meta);
      ApiResponse.created(res, "Provider listing registered successfully", provider);
    } catch (error) {
      next(error);
    }
  }

  async updateProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMeta(req);
      const updated = await bazaarService.updateProvider(id, req.body, meta);
      if (!updated) {
        ApiResponse.error(res, 404, "Provider listing not found");
        return;
      }
      ApiResponse.ok(res, "Provider listing updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meta = this.getMeta(req);
      const removed = await bazaarService.removeProvider(id, meta);
      if (!removed) {
        ApiResponse.error(res, 404, "Provider listing not found");
        return;
      }
      ApiResponse.ok(res, "Provider listing removed successfully", { id });
    } catch (error) {
      next(error);
    }
  }

  async getCapabilities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string;
      const capabilities = await bazaarService.listCapabilities(category);
      ApiResponse.ok(res, "Platform capabilities retrieved successfully", capabilities);
    } catch (error) {
      next(error);
    }
  }

  async createCapability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cap = await bazaarService.registerCapability(req.body);
      ApiResponse.created(res, "Capability registered successfully", cap);
    } catch (error) {
      next(error);
    }
  }

  async searchAndRank(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = this.getMeta(req);
      const params = {
        capability: req.query.capability as string,
        network: req.query.network as string,
        merchantId: req.query.merchantId as string,
        status: req.query.status as string,
        availability: req.query.availability !== undefined ? req.query.availability === "true" : undefined,
        merchantVerifiedOnly: req.query.merchantVerifiedOnly === "true",
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await bazaarService.searchAndRank(params, meta);
      ApiResponse.ok(res, "Bazaar candidate search completed", result);
    } catch (error) {
      next(error);
    }
  }

  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await bazaarService.getOverviewMetrics();
      ApiResponse.ok(res, "Bazaar overview telemetry retrieved successfully", metrics);
    } catch (error) {
      next(error);
    }
  }
}

export const bazaarController = new BazaarController();
