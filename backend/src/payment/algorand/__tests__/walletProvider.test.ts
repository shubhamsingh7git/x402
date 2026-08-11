import { algorandWalletProvider } from "../wallet/AlgorandWalletProvider";

const testWalletProvider = async () => {
  console.log("🧪 Testing AlgorandWalletProvider address derivation and message signing...");

  const address = algorandWalletProvider.getAddress();
  if (!address || address.length < 50) {
    throw new Error(`Invalid Algorand wallet address generated: ${address}`);
  }
  console.log(`  Derived Algorand Address: ${algorandWalletProvider.getMaskedAddress()}`);

  const message = "x402-unit-test-signature-payload";
  const signed = await algorandWalletProvider.signMessage(message);

  if (!signed.signature || !signed.publicKey) {
    throw new Error("Failed to generate ED25519 signature payload");
  }

  console.log(`  Signature derived successfully: ${signed.signature.substring(0, 16)}...`);
  console.log("✅ AlgorandWalletProvider test PASSED!");
};

testWalletProvider().catch((err) => {
  console.error("❌ AlgorandWalletProvider test failed:", err);
  process.exit(1);
});
