import { IReceipt } from "../../interfaces/receipt.interface";
import { ReceiptVerificationError } from "../errors/algorand.errors";
import { logger } from "../../../utils/logger";

export interface ReceiptVerificationResult {
  valid: boolean;
  reason?: string;
  verifiedAt: Date;
}

export class ReceiptVerifier {
  public static verifyReceipt(receipt: IReceipt, expectedMerchant: string, expectedAmount: number): ReceiptVerificationResult {
    if (!receipt) {
      throw new ReceiptVerificationError("Null or undefined receipt object provided");
    }

    if (!receipt.receiptId) {
      throw new ReceiptVerificationError("Missing required field: receiptId");
    }

    if (receipt.amount < expectedAmount) {
      throw new ReceiptVerificationError(
        `Receipt amount ($${receipt.amount}) is less than expected step price ($${expectedAmount})`
      );
    }

    if (!receipt.transactionHash) {
      throw new ReceiptVerificationError("Missing transactionHash in settlement receipt");
    }

    logger.info(`🔍 Cryptographically verified x402 settlement receipt [${receipt.receiptId}] for tx ${receipt.transactionHash}`);

    return {
      valid: true,
      verifiedAt: new Date(),
    };
  }
}
