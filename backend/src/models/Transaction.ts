import mongoose, { Schema, Document } from "mongoose";
import { TRANSACTION_STATUS } from "../constants/status";

export interface ITransactionDocument extends Document {
  merchant: string;
  amount: number;
  status: string;
  txHash: string;
  wallet: string;
  walletAddress?: string;
  network: string;
  scheme?: string;
  assetId?: number;
  blockRound?: number;
  confirmationRound?: number;
  receipt?: Record<string, unknown>;
  facilitatorResponse?: Record<string, unknown>;
  protocolSessionId?: string;
  settledAt?: Date;
  policyDecision?: string;
  decisionReason?: string;
  policySnapshot?: {
    transactionLimit: number;
    dailyBudget: number;
    maxTxPerMinute: number;
    killSwitch: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    merchant: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
    txHash: {
      type: String,
      default: "0x0000000000000000000000000000000000000000",
    },
    wallet: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
    },
    network: {
      type: String,
      required: true,
    },
    scheme: {
      type: String,
    },
    assetId: {
      type: Number,
    },
    blockRound: {
      type: Number,
    },
    confirmationRound: {
      type: Number,
    },
    receipt: {
      type: Schema.Types.Mixed,
    },
    facilitatorResponse: {
      type: Schema.Types.Mixed,
    },
    protocolSessionId: {
      type: String,
    },
    settledAt: {
      type: Date,
    },
    policyDecision: {
      type: String,
    },
    decisionReason: {
      type: String,
      default: "",
    },
    policySnapshot: {
      transactionLimit: { type: Number, default: 0 },
      dailyBudget: { type: Number, default: 0 },
      maxTxPerMinute: { type: Number, default: 0 },
      killSwitch: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for scaling analytics & filtering
transactionSchema.index({ merchant: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ network: 1, createdAt: -1 });
transactionSchema.index({ wallet: 1, createdAt: -1 });
transactionSchema.index({ txHash: 1 });

export const Transaction = mongoose.model<ITransactionDocument>("Transaction", transactionSchema);
