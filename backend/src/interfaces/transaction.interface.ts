import { TransactionStatus, PaymentScheme, PolicyDecision } from "../constants/status";

export interface ITransaction {
  _id: string;
  merchant: string;
  amount: number;
  status: TransactionStatus;
  txHash: string;
  wallet: string;
  network: string;
  scheme?: PaymentScheme;
  policyDecision?: PolicyDecision;
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

export interface IAuditLog {
  _id: string;
  action: string;
  user?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
