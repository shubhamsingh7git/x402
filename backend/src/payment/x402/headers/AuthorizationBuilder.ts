import { IAuthorizationBuilder, X402Authorization, X402Challenge } from "../interfaces/x402.interface";
import { PaymentContext } from "../../dto/paymentContext";
import { algorandWalletProvider } from "../../algorand/wallet/AlgorandWalletProvider";
import { logger } from "../../../utils/logger";

export class AuthorizationBuilder implements IAuthorizationBuilder {
  async buildAuthorization(challenge: X402Challenge, context: PaymentContext): Promise<X402Authorization> {
    const scheme = "X402-ALGORAND-ED25519";
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minute validity window
    const walletAddress = algorandWalletProvider.getAddress();

    // Payload statement to be cryptographically signed by Algorand ED25519 session key
    const messageToSign = `x402-authorize:${context.paymentId}:${context.merchantId}:${context.amount}:${challenge.network}:${Date.now()}`;
    const signedObj = await algorandWalletProvider.signMessage(messageToSign);

    const tokenPayload = {
      signer: walletAddress,
      signature: signedObj.signature,
      publicKey: signedObj.publicKey,
      paymentId: context.paymentId,
      merchantId: context.merchantId,
      amount: context.amount,
      asset: challenge.asset || "USDC",
      network: challenge.network || "algorand:testnet",
      timestamp: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    const headers: Record<string, string> = {
      Authorization: `${scheme} ${token}`,
      "x-402-payment-id": context.paymentId,
      "x-402-correlation-id": context.correlationId,
      "x-402-amount": context.amount.toString(),
      "x-402-merchant": context.merchantId,
      "x-402-signer": walletAddress,
    };

    logger.info(`✍️ Built signed x402 authorization payload for merchant ${context.merchantId} [Signer: ${algorandWalletProvider.getMaskedAddress()}]`);

    return {
      scheme,
      token,
      headers,
      expiresAt,
    };
  }
}

export const authorizationBuilder = new AuthorizationBuilder();
