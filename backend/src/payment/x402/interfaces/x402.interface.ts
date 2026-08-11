import { PaymentContext } from "../../dto/paymentContext";
import { PaymentResultDTO } from "../../dto/paymentResult.dto";
import { IReceipt } from "../../interfaces/receipt.interface";

export interface X402Challenge {
  version: string;
  merchant: string;
  asset: string;
  network: string;
  amount: number;
  paymentRequirements?: Record<string, unknown>;
  resource?: string;
  metadata: Record<string, unknown>;
}

export interface X402Authorization {
  scheme: string;
  token: string;
  headers: Record<string, string>;
  expiresAt: Date;
}

export interface IX402Client {
  executeProtocol(context: PaymentContext): Promise<PaymentResultDTO>;
}

export interface IChallengeParser {
  parseChallenge(responseHeaders: Record<string, string>, responseBody?: unknown): X402Challenge;
}

export interface IAuthorizationBuilder {
  buildAuthorization(challenge: X402Challenge, context: PaymentContext): Promise<X402Authorization>;
}

export interface IReceiptParser {
  parseReceipt(headers: Record<string, string>, body: unknown, context: PaymentContext): IReceipt;
}

export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
}

export interface HttpRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
}

export interface ITransport {
  request<T = any>(options: HttpRequestOptions): Promise<HttpResponse<T>>;
}
