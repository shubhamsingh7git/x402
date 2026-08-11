export interface StrategyResult {
  name: string;
  status: "PASS" | "FAIL";
  reason?: string;
}

export interface MerchantVerificationResult {
  merchantId: string;
  verified: boolean;
  status: string;
  checkedAt: Date;
  expiresAt: Date;
  reason: string;
  warnings: string[];
  verificationResults: {
    wallet: "PASS" | "FAIL";
    network: "PASS" | "FAIL";
    policy: "PASS" | "FAIL";
    facilitator: "PASS" | "FAIL";
    apiService: "PASS" | "FAIL";
    [key: string]: "PASS" | "FAIL";
  };
  verificationSummary: {
    passedStrategies: number;
    failedStrategies: number;
    warnings: number;
  };
  verificationVersion: number;
  merchantSnapshot: {
    alias: string;
    walletAddress: string;
    network: string;
    status: string;
  };
}
