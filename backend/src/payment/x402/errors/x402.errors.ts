import { PaymentError } from "../../errors/payment.errors";

export class ProtocolError extends PaymentError {
  constructor(message: string, statusCode = 500, errors: string[] = [], paymentId?: string) {
    super(message, statusCode, errors, paymentId);
    Object.setPrototypeOf(this, ProtocolError.prototype);
  }
}

export class HTTP402Error extends ProtocolError {
  public responseHeaders: Record<string, string>;
  public responseBody?: any;

  constructor(headers: Record<string, string>, body?: any, paymentId?: string) {
    super("HTTP 402 Payment Required Challenge Received", 402, [], paymentId);
    this.responseHeaders = headers;
    this.responseBody = body;
    Object.setPrototypeOf(this, HTTP402Error.prototype);
  }
}

export class ChallengeParseError extends ProtocolError {
  constructor(reason: string, paymentId?: string) {
    super(`Failed to parse x402 Challenge: ${reason}`, 400, [reason], paymentId);
    Object.setPrototypeOf(this, ChallengeParseError.prototype);
  }
}

export class AuthorizationError extends ProtocolError {
  constructor(reason: string, paymentId?: string) {
    super(`Failed to build x402 Authorization: ${reason}`, 400, [reason], paymentId);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class ReceiptParseError extends ProtocolError {
  constructor(reason: string, paymentId?: string) {
    super(`Failed to parse x402 Receipt: ${reason}`, 400, [reason], paymentId);
    Object.setPrototypeOf(this, ReceiptParseError.prototype);
  }
}

export class ProtocolNegotiationError extends ProtocolError {
  constructor(reason: string, paymentId?: string) {
    super(`Protocol negotiation failed: ${reason}`, 502, [reason], paymentId);
    Object.setPrototypeOf(this, ProtocolNegotiationError.prototype);
  }
}

export class TransportError extends ProtocolError {
  constructor(message: string, statusCode = 500, paymentId?: string) {
    super(`Transport error: ${message}`, statusCode, [], paymentId);
    Object.setPrototypeOf(this, TransportError.prototype);
  }
}

export class RetryExceededError extends ProtocolError {
  constructor(maxRetries: number, paymentId?: string) {
    super(`Max transport retries (${maxRetries}) exceeded`, 504, [], paymentId);
    Object.setPrototypeOf(this, RetryExceededError.prototype);
  }
}
