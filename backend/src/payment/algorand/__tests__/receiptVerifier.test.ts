import { ReceiptVerifier } from "../receipts/ReceiptVerifier";
import { DemoReceipt } from "../../dto/receipt.dto";

const testReceiptVerifier = () => {
  console.log("🧪 Testing ReceiptVerifier receipt validation...");

  const receipt = new DemoReceipt(
    "pmt_test_123",
    "OpenAI API",
    0.01,
    "USDC",
    "Base Sepolia Testnet",
    "0xalgo_test_hash_123"
  );

  const verification = ReceiptVerifier.verifyReceipt(receipt, "OpenAI API", 0.01);
  if (!verification.valid) {
    throw new Error(`Receipt verification failed: ${verification.reason}`);
  }

  let caughtError = false;
  try {
    ReceiptVerifier.verifyReceipt(receipt, "OpenAI API", 0.05); // Price higher than receipt
  } catch (err: any) {
    caughtError = true;
    console.log(`  Caught expected verification error for price mismatch: ${err.message}`);
  }

  if (!caughtError) {
    throw new Error("Expected price mismatch error during receipt verification");
  }

  console.log("✅ ReceiptVerifier test PASSED!");
};

testReceiptVerifier();
