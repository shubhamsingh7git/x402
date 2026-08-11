export interface IReceipt {
  receiptId: string;
  paymentId: string;
  transactionHash?: string;
  merchantAddress: string;
  amount: number;
  currency: string;
  network: string;
  issuedAt: Date;
  metadata: Record<string, unknown>;
}
