import { ApiError } from "../../utils/ApiError";

export class PaymentError extends ApiError {
  public paymentId?: string;
  public correlationId?: string;

  constructor(message: string, statusCode = 500, errors: string[] = [], paymentId?: string) {
    super(statusCode, message, errors);
    this.paymentId = paymentId;
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

export class PolicyViolationError extends PaymentError {
  constructor(reason: string, paymentId?: string) {
    super(`Policy Guard Violation: ${reason}`, 403, [reason], paymentId);
    Object.setPrototypeOf(this, PolicyViolationError.prototype);
  }
}

export class MerchantDisabledError extends PaymentError {
  constructor(merchantId: string, paymentId?: string) {
    super(`Merchant [${merchantId}] is inactive, blocked, or soft-deleted`, 403, [], paymentId);
    Object.setPrototypeOf(this, MerchantDisabledError.prototype);
  }
}

export class BudgetExceededError extends PaymentError {
  constructor(reason: string, paymentId?: string) {
    super(`Budget Ceiling Exceeded: ${reason}`, 403, [reason], paymentId);
    Object.setPrototypeOf(this, BudgetExceededError.prototype);
  }
}

export class VelocityLimitError extends PaymentError {
  constructor(reason: string, paymentId?: string) {
    super(`Rate Limit Exceeded: ${reason}`, 429, [reason], paymentId);
    Object.setPrototypeOf(this, VelocityLimitError.prototype);
  }
}

export class ServiceUnavailableError extends PaymentError {
  constructor(serviceId: string, paymentId?: string) {
    super(`Requested Service [${serviceId}] is unavailable or disabled`, 503, [], paymentId);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

export class InvalidPaymentError extends PaymentError {
  constructor(reason: string, paymentId?: string) {
    super(`Invalid Payment Request: ${reason}`, 400, [reason], paymentId);
    Object.setPrototypeOf(this, InvalidPaymentError.prototype);
  }
}

export class PaymentStateError extends PaymentError {
  constructor(fromState: string, toState: string, paymentId?: string) {
    super(`Illegal state transition from ${fromState} to ${toState}`, 400, [], paymentId);
    Object.setPrototypeOf(this, PaymentStateError.prototype);
  }
}

export class PaymentConfigurationError extends PaymentError {
  constructor(reason: string) {
    super(`Payment System Configuration Error: ${reason}`, 500);
    Object.setPrototypeOf(this, PaymentConfigurationError.prototype);
  }
}
