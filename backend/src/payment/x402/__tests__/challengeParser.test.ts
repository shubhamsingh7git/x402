import { challengeParser } from "../challenge/ChallengeParser";

const testChallengeParser = () => {
  console.log("🧪 Testing ChallengeParser parsing headers & body...");

  const rawHeaders = {
    "WWW-Authenticate": "x402 realm=api",
    "x-402-merchant": "Market Data Inc",
    "x-402-amount": "0.02",
    "x-402-asset": "USDC",
    "x-402-network": "Base Sepolia Testnet",
    "x-402-version": "1.0",
  };

  const parsed = challengeParser.parseChallenge(rawHeaders);

  if (parsed.merchant !== "Market Data Inc") {
    throw new Error(`Expected merchant 'Market Data Inc', got '${parsed.merchant}'`);
  }
  if (parsed.amount !== 0.02) {
    throw new Error(`Expected amount 0.02, got ${parsed.amount}`);
  }
  if (parsed.version !== "1.0") {
    throw new Error(`Expected version '1.0', got '${parsed.version}'`);
  }

  console.log("✅ ChallengeParser test PASSED!");
};

testChallengeParser();
