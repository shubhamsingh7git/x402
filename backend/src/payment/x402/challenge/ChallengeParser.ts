import { IChallengeParser, X402Challenge } from "../interfaces/x402.interface";
import { ChallengeParseError } from "../errors/x402.errors";

export class ChallengeParser implements IChallengeParser {
  parseChallenge(responseHeaders: Record<string, string>, responseBody?: any): X402Challenge {
    const headers = this.normalizeHeaders(responseHeaders);

    // 1. Look for WWW-Authenticate or x-402 headers or body
    const wwwAuth = headers["www-authenticate"] || headers["x-402-challenge"];
    const bodyChallenge = responseBody?.challenge || responseBody?.paymentRequirements;

    const merchant =
      headers["x-402-merchant"] ||
      bodyChallenge?.merchant ||
      "OpenAI API";

    const asset =
      headers["x-402-asset"] ||
      bodyChallenge?.asset ||
      "USDC";

    const network =
      headers["x-402-network"] ||
      bodyChallenge?.network ||
      "Base Sepolia Testnet";

    const amountStr = headers["x-402-amount"] || bodyChallenge?.amount || "0.01";
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount < 0) {
      throw new ChallengeParseError(`Invalid challenge amount: ${amountStr}`);
    }

    const version = headers["x-402-version"] || bodyChallenge?.version || "1.0";

    return {
      version,
      merchant,
      asset,
      network,
      amount,
      paymentRequirements: {
        scheme: headers["x-402-scheme"] || "Exact",
        payTo: merchant,
        network,
        asset,
      },
      resource: headers["x-402-resource"] || responseBody?.resource,
      metadata: {
        rawHeaders: responseHeaders,
        parsedAt: new Date().toISOString(),
        wwwAuthHeader: wwwAuth,
      },
    };
  }

  private normalizeHeaders(headers: Record<string, string>): Record<string, string> {
    const normalized: Record<string, string> = {};
    for (const key of Object.keys(headers)) {
      normalized[key.toLowerCase()] = headers[key];
    }
    return normalized;
  }
}

export const challengeParser = new ChallengeParser();
