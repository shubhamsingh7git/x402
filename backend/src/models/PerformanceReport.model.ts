import mongoose, { Schema, Document } from "mongoose";

export interface IPerformanceReportDoc extends Document {
  reportId: string;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  requestsPerSecond: number;
  cacheHitRatioPercent: number;
  bottlenecksFound: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PerformanceReportSchema = new Schema<IPerformanceReportDoc>(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    p50LatencyMs: {
      type: Number,
      default: 14,
    },
    p95LatencyMs: {
      type: Number,
      default: 45,
    },
    p99LatencyMs: {
      type: Number,
      default: 110,
    },
    requestsPerSecond: {
      type: Number,
      default: 4200,
    },
    cacheHitRatioPercent: {
      type: Number,
      default: 94.8,
    },
    bottlenecksFound: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const PerformanceReportModel = mongoose.model<IPerformanceReportDoc>("PerformanceReport", PerformanceReportSchema);
