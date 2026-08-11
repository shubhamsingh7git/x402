import { Request, Response, NextFunction } from "express";
import { apiServiceService } from "../services/apiService/apiService.service";
import { ApiResponse } from "../utils/ApiResponse";

export class ApiServiceController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await apiServiceService.listServices();
      ApiResponse.ok(res, "API services retrieved successfully", services);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const service = await apiServiceService.getServiceById(id);
      ApiResponse.ok(res, "API service retrieved successfully", service);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await apiServiceService.createService(req.body);
      ApiResponse.created(res, "API service created successfully", service);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const service = await apiServiceService.updateService(id, req.body);
      ApiResponse.ok(res, "API service updated successfully", service);
    } catch (error) {
      next(error);
    }
  }

  async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { isEnabled } = req.body;
      const service = await apiServiceService.toggleService(id, isEnabled);
      ApiResponse.ok(res, `API service ${isEnabled ? "enabled" : "disabled"} successfully`, service);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await apiServiceService.deleteService(id);
      ApiResponse.ok(res, "API service deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}

export const apiServiceController = new ApiServiceController();
