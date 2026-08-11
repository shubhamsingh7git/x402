import mongoose, { Schema, Document } from "mongoose";
import { MERCHANT_STATUS, MerchantStatus } from "../constants/status";

export interface IMerchantDocument extends Document {
  alias: string;
  walletAddress: string;
  address?: string;
  network: string;
  status: MerchantStatus;
  lastVerifiedAt?: Date;
  verificationExpiresAt?: Date;
  verificationStatus?: "VALID" | "EXPIRED" | "PENDING";
  verificationReason?: string;
  verificationVersion: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const merchantSchema = new Schema<IMerchantDocument>(
  {
    alias: {
      type: String,
      required: [true, "Alias is required"],
      trim: true,
    },
    walletAddress: {
      type: String,
      required: [true, "Wallet address is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    network: {
      type: String,
      required: [true, "Network is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(MERCHANT_STATUS),
      default: MERCHANT_STATUS.PENDING,
    },
    lastVerifiedAt: {
      type: Date,
    },
    verificationExpiresAt: {
      type: Date,
    },
    verificationStatus: {
      type: String,
      enum: ["VALID", "EXPIRED", "PENDING"],
      default: "PENDING",
    },
    verificationReason: {
      type: String,
    },
    verificationVersion: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

merchantSchema.index({ walletAddress: 1 });
merchantSchema.index({ status: 1, isDeleted: 1 });
merchantSchema.index({ verificationExpiresAt: 1, status: 1 });

export const Merchant = mongoose.model<IMerchantDocument>("Merchant", merchantSchema);
