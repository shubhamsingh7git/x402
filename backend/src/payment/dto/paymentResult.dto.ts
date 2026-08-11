import { IReceipt } from "../interfaces/receipt.interface";

export interface PaymentResultDTO {
  success: boolean;
  paymentId: string;
  correlationId: string;
  status: string;
  amount: number;
  currency: string;
  transactionId?: string;
  receipt?: IReceipt;
  latencyMs: number;
  metadata: Record<string, unknown>;
  error?: string;
}
