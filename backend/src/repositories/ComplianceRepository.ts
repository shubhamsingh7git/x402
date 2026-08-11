import { ComplianceReportModel, IComplianceReportDoc } from "../models/ComplianceReport.model";

export class ComplianceRepository {
  async saveReport(data: Partial<IComplianceReportDoc>): Promise<IComplianceReportDoc> {
    return ComplianceReportModel.findOneAndUpdate(
      { framework: data.framework },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IComplianceReportDoc>;
  }

  async findReports(): Promise<IComplianceReportDoc[]> {
    return ComplianceReportModel.find({}).sort({ framework: 1 }).exec();
  }
}

export const complianceRepository = new ComplianceRepository();
