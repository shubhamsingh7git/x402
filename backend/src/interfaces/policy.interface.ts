import { MerchantStatus } from "../constants/status";

export interface IMerchant {
  _id: string;
  alias: string;
  walletAddress: string;
  address?: string;
  network: string;
  status: MerchantStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPolicy {
  _id: string;
  merchant: string;
  dailyBudget: number;
  transactionLimit: number;
  maxTransactionsPerMinute: number;
  killSwitch: boolean;
  enabled: boolean;
  version: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPolicyCreatePayload {
  merchant: string;
  dailyBudget: number;
  transactionLimit: number;
  maxTransactionsPerMinute?: number;
  killSwitch?: boolean;
  enabled?: boolean;
}

export interface IPolicyUpdatePayload {
  dailyBudget?: number;
  transactionLimit?: number;
  maxTransactionsPerMinute?: number;
  killSwitch?: boolean;
  enabled?: boolean;
}

export interface IMerchantCreatePayload {
  alias: string;
  walletAddress: string;
  network: string;
  status?: MerchantStatus;
}

export interface IMerchantUpdatePayload {
  alias?: string;
  walletAddress?: string;
  network?: string;
  status?: MerchantStatus;
}
