import { PaymentContext } from "../dto/paymentContext";
import { PaymentResultDTO } from "../dto/paymentResult.dto";
import { IReceipt } from "./receipt.interface";

export interface IPaymentProvider {
  readonly providerName: string;
  supports(network: string): boolean;
  processPayment(context: PaymentContext): Promise<PaymentResultDTO>;
}

export interface IWalletProvider {
  readonly networkId: string;
  getAddress(): string;
  signTransaction(unsignedTx: unknown): Promise<string>;
}

export interface IFacilitatorProvider {
  readonly endpoint: string;
  verifyPayment(proof: unknown): Promise<boolean>;
  submitSettlement(signedTx: string): Promise<{ txHash: string }>;
}

export interface ISettlementProvider {
  confirmFinality(txHash: string): Promise<boolean>;
}

export interface IReceiptProvider {
  generateReceipt(context: PaymentContext, txHash?: string): IReceipt;
}
