import { PaymentError } from "../../errors/payment.errors";

export class AlgorandError extends PaymentError {
  constructor(message: string, statusCode = 500, errors: string[] = [], paymentId?: string) {
    super(message, statusCode, errors, paymentId);
    Object.setPrototypeOf(this, AlgorandError.prototype);
  }
}

export class WalletInitializationError extends AlgorandError {
  constructor(reason: string) {
    super(`Wallet Initialization Failed: ${reason}`, 500, [reason]);
    Object.setPrototypeOf(this, WalletInitializationError.prototype);
  }
}

export class WalletConfigurationError extends AlgorandError {
  constructor(reason: string) {
    super(`Wallet Configuration Error: ${reason}`, 500, [reason]);
    Object.setPrototypeOf(this, WalletConfigurationError.prototype);
  }
}

export class MnemonicValidationError extends AlgorandError {
  constructor(reason: string) {
    super(`Mnemonic Validation Failed: ${reason}`, 400, [reason]);
    Object.setPrototypeOf(this, MnemonicValidationError.prototype);
  }
}

export class SigningError extends AlgorandError {
  constructor(reason: string, paymentId?: string) {
    super(`Algorand Cryptographic Signing Error: ${reason}`, 500, [reason], paymentId);
    Object.setPrototypeOf(this, SigningError.prototype);
  }
}

export class AuthorizationGenerationError extends AlgorandError {
  constructor(reason: string, paymentId?: string) {
    super(`Authorization Generation Error: ${reason}`, 400, [reason], paymentId);
    Object.setPrototypeOf(this, AuthorizationGenerationError.prototype);
  }
}

export class FacilitatorCommunicationError extends AlgorandError {
  constructor(reason: string, paymentId?: string) {
    super(`GoPlausible Facilitator Communication Error: ${reason}`, 502, [reason], paymentId);
    Object.setPrototypeOf(this, FacilitatorCommunicationError.prototype);
  }
}

export class ReceiptVerificationError extends AlgorandError {
  constructor(reason: string, paymentId?: string) {
    super(`Receipt Verification Error: ${reason}`, 400, [reason], paymentId);
    Object.setPrototypeOf(this, ReceiptVerificationError.prototype);
  }
}

export class InsufficientBalanceError extends AlgorandError {
  constructor(asset: string, required: number, available: number, paymentId?: string) {
    super(
      `Insufficient ${asset} balance. Required: ${required}, Available: ${available}`,
      402,
      [`Required ${required} ${asset}, found ${available}`],
      paymentId
    );
    Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
  }
}

export class NetworkUnavailableError extends AlgorandError {
  constructor(network: string) {
    super(`Algorand Network [${network}] is unreachable`, 503);
    Object.setPrototypeOf(this, NetworkUnavailableError.prototype);
  }
}

export class AlgorandConnectionError extends AlgorandError {
  constructor(reason: string) {
    super(`Algod Node Connection Error: ${reason}`, 503);
    Object.setPrototypeOf(this, AlgorandConnectionError.prototype);
  }
}

export class TransactionSubmissionError extends AlgorandError {
  constructor(reason: string, paymentId?: string) {
    super(`Transaction Submission Error: ${reason}`, 502, [reason], paymentId);
    Object.setPrototypeOf(this, TransactionSubmissionError.prototype);
  }
}

export class SettlementTimeoutError extends AlgorandError {
  constructor(txId: string, paymentId?: string) {
    super(`Settlement confirmation timed out for transaction ${txId}`, 504, [], paymentId);
    Object.setPrototypeOf(this, SettlementTimeoutError.prototype);
  }
}
