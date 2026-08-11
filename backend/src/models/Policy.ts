import mongoose, { Schema, Document } from "mongoose";

export interface IPolicyDocument extends Document {
  merchant: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  transactionLimit: number;
  dailyBudget: number;
  maxTransactionsPerMinute: number;
  enabled: boolean;
  killSwitch: boolean;
  version: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const policySchema = new Schema<IPolicyDocument>(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: [true, "Merchant is required"],
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transactionLimit: {
      type: Number,
      required: true,
      default: 0.05,
      min: 0,
    },
    dailyBudget: {
      type: Number,
      required: true,
      default: 10.0,
      min: 0,
    },
    maxTransactionsPerMinute: {
      type: Number,
      required: true,
      default: 30,
      min: 1,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    killSwitch: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Policy = mongoose.model<IPolicyDocument>("Policy", policySchema);
