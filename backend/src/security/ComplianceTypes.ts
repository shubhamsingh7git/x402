export interface IComplianceReportDTO {
  framework: string; // "GDPR" | "SOC2" | "ISO27001" | "HIPAA"
  overallStatus: "COMPLIANT" | "NON_COMPLIANT" | "PARTIAL" | string;
  passedControlsCount: number;
  totalControlsCount: number;
  scorePercent: number;
  lastAuditedAt: string | Date;
}
