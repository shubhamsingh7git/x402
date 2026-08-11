import { PaymentProviderFactory } from "../../factory/paymentProvider.factory";

const testProviderFactory = () => {
  console.log("🧪 Testing PaymentProviderFactory resolving modes...");

  const demoProvider = PaymentProviderFactory.getProvider("demo");
  if (demoProvider.providerName !== "DemoPaymentProvider") {
    throw new Error(`Expected DemoPaymentProvider for demo mode, got ${demoProvider.providerName}`);
  }

  const protocolProvider = PaymentProviderFactory.getProvider("protocol");
  if (protocolProvider.providerName !== "X402PaymentProvider") {
    throw new Error(`Expected X402PaymentProvider for protocol mode, got ${protocolProvider.providerName}`);
  }

  let caughtError = false;
  try {
    PaymentProviderFactory.getProvider("live");
  } catch (err: any) {
    caughtError = true;
    console.log(`  Caught expected error for live mode: ${err.message}`);
  }

  if (!caughtError) {
    throw new Error("Expected exception when selecting live mode in Milestone 4.2");
  }

  console.log("✅ PaymentProviderFactory test PASSED!");
};

testProviderFactory();
