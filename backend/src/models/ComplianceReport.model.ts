import mongoose, { Schema, Document } from "mongoose";

export interface IComplianceReportDoc extends Document {
  framework: string;
  overallStatus: string;
  passedControlsCount: number;
  totalControlsCount: number;
  scorePercent: number;
  lastAuditedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceReportSchema = new Schema<IComplianceReportDoc>(
  {
    framework: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    overallStatus: {
      type: String,
      default: "COMPLIANT",
    },
    passedControlsCount: {
      type: Number,
      required: true,
    },
    totalControlsCount: {
      type: Number,
      required: true,
    },
    scorePercent: {
      type: Number,
      required: true,
    },
    lastAuditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ComplianceReportModel = mongoose.model<IComplianceReportDoc>("ComplianceReport", ComplianceReportSchema);
