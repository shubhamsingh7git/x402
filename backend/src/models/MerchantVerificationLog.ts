import mongoose, { Schema, Document } from "mongoose";

export interface IMerchantVerificationLogDocument extends Document {
  merchant: mongoose.Types.ObjectId;
  merchantAlias: string;
  statusBefore: string;
  statusAfter: string;
  reason: string;
  checkedAt: Date;
  durationMs: number;
  performedBy: string;
  strategiesResults: Record<string, { name: string; status: "PASS" | "FAIL"; reason?: string }>;
  verificationVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const merchantVerificationLogSchema = new Schema<IMerchantVerificationLogDocument>(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },
    merchantAlias: {
      type: String,
      required: true,
    },
    statusBefore: {
      type: String,
      required: true,
    },
    statusAfter: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    performedBy: {
      type: String,
      default: "MerchantVerificationService",
    },
    strategiesResults: {
      type: Schema.Types.Mixed,
      required: true,
    },
    verificationVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

merchantVerificationLogSchema.index({ merchant: 1, checkedAt: -1 });

export const MerchantVerificationLog = mongoose.model<IMerchantVerificationLogDocument>(
  "MerchantVerificationLog",
  merchantVerificationLogSchema
);
