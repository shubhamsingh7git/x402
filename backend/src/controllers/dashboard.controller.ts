import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard/dashboard.service";
import { ApiResponse } from "../utils/ApiResponse";

export class DashboardController {
  async getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const overview = await dashboardService.getOverview();
      ApiResponse.ok(res, "Dashboard overview retrieved successfully", overview);
    } catch (error) {
      next(error);
    }
  }

  async getCharts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const charts = await dashboardService.getCharts();
      ApiResponse.ok(res, "Dashboard chart data retrieved successfully", charts);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
