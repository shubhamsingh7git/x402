import mongoose, { Schema, Document } from "mongoose";

export interface IProviderReputation extends Document {
  providerId: string;
  reputationScore: number; // 0.0 to 100.0
  averageRating: number;
  reviewCount: number;
  executionSuccessRate: number;
  averageLatencyMs: number;
  slaCompliancePercentage: number;
  verificationBadge: boolean;
  certifiedBadge: boolean;
  lastRecalculatedAt: Date;
}

const ProviderReputationSchema = new Schema<IProviderReputation>(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reputationScore: {
      type: Number,
      default: 85.0,
      index: true,
    },
    averageRating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 1,
    },
    executionSuccessRate: {
      type: Number,
      default: 99.2,
    },
    averageLatencyMs: {
      type: Number,
      default: 120,
    },
    slaCompliancePercentage: {
      type: Number,
      default: 99.9,
    },
    verificationBadge: {
      type: Boolean,
      default: false,
    },
    certifiedBadge: {
      type: Boolean,
      default: false,
    },
    lastRecalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ProviderReputation = mongoose.model<IProviderReputation>("ProviderReputation", ProviderReputationSchema);
