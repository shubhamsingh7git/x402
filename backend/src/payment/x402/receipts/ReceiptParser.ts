import { IReceiptParser } from "../interfaces/x402.interface";
import { IReceipt } from "../../interfaces/receipt.interface";
import { PaymentContext } from "../../dto/paymentContext";
import { DemoReceipt } from "../../dto/receipt.dto";

export class X402Receipt implements IReceipt {
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
    receiptId: string,
    paymentId: string,
    merchantAddress: string,
    amount: number,
    currency: string,
    network: string,
    transactionHash?: string,
    metadata: Record<string, unknown> = {}
  ) {
    this.receiptId = receiptId;
    this.paymentId = paymentId;
    this.transactionHash = transactionHash;
    this.merchantAddress = merchantAddress;
    this.amount = amount;
    this.currency = currency;
    this.network = network;
    this.issuedAt = new Date();
    this.metadata = { ...metadata, provider: "X402PaymentProvider", protocolVersion: "1.0" };
  }
}

export class ReceiptParser implements IReceiptParser {
  parseReceipt(headers: Record<string, string>, body: any, context: PaymentContext): IReceipt {
    const normalizedHeaders: Record<string, string> = {};
    for (const k of Object.keys(headers)) {
      normalizedHeaders[k.toLowerCase()] = headers[k];
    }

    const receiptId =
      normalizedHeaders["x-402-receipt-id"] ||
      body?.receiptId ||
      `rcpt_x402_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const txHash =
      normalizedHeaders["x-402-tx-hash"] ||
      body?.txHash ||
      `0x402${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.substring(0, 42);

    return new X402Receipt(
      receiptId,
      context.paymentId,
      context.merchantId,
      context.amount,
      context.currency,
      context.network,
      txHash,
      { responseBody: body }
    );
  }
}

export const receiptParser = new ReceiptParser();
