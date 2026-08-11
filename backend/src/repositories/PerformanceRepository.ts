import { PerformanceReportModel, IPerformanceReportDoc } from "../models/PerformanceReport.model";

export class PerformanceRepository {
  async saveReport(data: Partial<IPerformanceReportDoc>): Promise<IPerformanceReportDoc> {
    const doc = new PerformanceReportModel(data);
    return doc.save();
  }

  async findLatestReport(): Promise<IPerformanceReportDoc | null> {
    return PerformanceReportModel.findOne({}).sort({ createdAt: -1 }).exec();
  }
}

export const performanceRepository = new PerformanceRepository();
