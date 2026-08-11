import { analyticsService } from "../analytics/analytics.service";

export class DashboardService {
  async getOverview() {
    return analyticsService.getOverviewData();
  }

  async getCharts() {
    return analyticsService.getChartData();
  }
}

export const dashboardService = new DashboardService();
