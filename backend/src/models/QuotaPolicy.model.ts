import mongoose, { Schema, Document } from "mongoose";

export interface IQuotaPolicyDoc extends Document {
  quotaId: string;
  organizationId: string;
  maxDailySpendUsd: number;
  maxDailyRequests: number;
  currentDailySpendUsd: number;
  currentDailyRequests: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuotaPolicySchema = new Schema<IQuotaPolicyDoc>(
  {
    quotaId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    organizationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    maxDailySpendUsd: {
      type: Number,
      default: 500,
    },
    maxDailyRequests: {
      type: Number,
      default: 10000,
    },
    currentDailySpendUsd: {
      type: Number,
      default: 0,
    },
    currentDailyRequests: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const QuotaPolicyModel = mongoose.model<IQuotaPolicyDoc>("QuotaPolicy", QuotaPolicySchema);
