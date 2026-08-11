import { AbstractPaymentProvider } from "../../providers/AbstractPaymentProvider";
import { PaymentContext } from "../../dto/paymentContext";
import { PaymentResultDTO } from "../../dto/paymentResult.dto";
import { x402Client, X402Client } from "../../x402/client/X402Client";
import { algorandWalletProvider } from "../wallet/AlgorandWalletProvider";
import { goPlausibleFacilitatorProvider } from "../facilitator/GoPlausibleFacilitatorProvider";
import { ReceiptVerifier } from "../receipts/ReceiptVerifier";
import { InsufficientBalanceError } from "../errors/algorand.errors";
import { eventBus } from "../../../events/eventBus";
import { logger } from "../../../utils/logger";

export class RealX402PaymentProvider extends AbstractPaymentProvider {
  readonly providerName = "RealX402PaymentProvider";
  private client: X402Client;

  constructor(client = x402Client) {
    super();
    this.client = client;
  }

  protected async executePayment(context: PaymentContext, _startTime: number): Promise<PaymentResultDTO> {
    logger.info(`🌐 RealX402PaymentProvider processing real x402 payment for $${context.amount} ${context.currency}`);

    // 1. Balance verification
    const usdcBalance = await algorandWalletProvider.getUsdcBalance();
    if (usdcBalance < context.amount) {
      throw new InsufficientBalanceError("USDC", context.amount, usdcBalance, context.paymentId);
    }

    // 2. Execute x402 negotiation loop via X402Client
    const result = await this.client.executeProtocol(context);

    if (!result.success) {
      eventBus.emitEvent("payment:failed" as any, { context, error: result.error });
      return result;
    }

    // 3. Submit proof to GoPlausible Facilitator
    eventBus.emitEvent("payment:submitted" as any, { context, amount: context.amount });
    const facilitatorReceipt = await goPlausibleFacilitatorProvider.submitSettlement({
      paymentId: context.paymentId,
      merchantId: context.merchantId,
      amount: context.amount,
      walletAddress: algorandWalletProvider.getAddress(),
    });

    // 4. Verify receipt with ReceiptVerifier
    if (result.receipt) {
      ReceiptVerifier.verifyReceipt(result.receipt, context.merchantId, context.amount);
      eventBus.emitEvent("receipt:verified" as any, { receipt: result.receipt, txHash: facilitatorReceipt.txHash });
    }

    logger.info(`✅ Real x402 Payment completed via GoPlausible Facilitator [TxHash: ${facilitatorReceipt.txHash}]`);

    return {
      ...result,
      transactionId: facilitatorReceipt.txHash,
      metadata: {
        ...result.metadata,
        walletAddress: algorandWalletProvider.getAddress(),
        blockRound: facilitatorReceipt.blockRound,
        facilitator: goPlausibleFacilitatorProvider.endpoint,
      },
    };
  }
}

export const realX402PaymentProvider = new RealX402PaymentProvider();
