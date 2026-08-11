import mongoose, { Schema, Document } from "mongoose";

export interface IPricingPolicy extends Document {
  providerId: string;
  tierName: string;
  pricePerCall: number;
  monthlyQuota: number;
  currency: string;
  freeTierCalls: number;
  enterpriseCustomPrice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPolicySchema = new Schema<IPricingPolicy>(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tierName: {
      type: String,
      default: "PAY_PER_CALL",
    },
    pricePerCall: {
      type: Number,
      default: 0.02,
    },
    monthlyQuota: {
      type: Number,
      default: 100000,
    },
    currency: {
      type: String,
      default: "USD",
    },
    freeTierCalls: {
      type: Number,
      default: 100,
    },
    enterpriseCustomPrice: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PricingPolicy = mongoose.model<IPricingPolicy>("PricingPolicy", PricingPolicySchema);
