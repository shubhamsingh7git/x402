import { IReceipt } from "../interfaces/receipt.interface";

export class DemoReceipt implements IReceipt {
  public receiptId: string;
  public paymentId: string;
  public transactionHash?: string;
  public merchantAddress: string;
  public amount: number;
  public currency: string;
  public network: string;
  public issuedAt: Date;
  public metadata: Record<string, unknown>;

  constructor(
    paymentId: string,
    merchantAddress: string,
    amount: number,
    currency = "USDC",
    network = "Base Sepolia Testnet",
    transactionHash?: string,
    metadata: Record<string, unknown> = {}
  ) {
    this.receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.paymentId = paymentId;
    this.transactionHash =
      transactionHash ||
      `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.substring(0, 42);
    this.merchantAddress = merchantAddress;
    this.amount = amount;
    this.currency = currency;
    this.network = network;
    this.issuedAt = new Date();
    this.metadata = { ...metadata, provider: "DemoPaymentProvider" };
  }
}
