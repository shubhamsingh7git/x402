import { env } from "../../../config/env";
import { WalletConfigurationError } from "../errors/algorand.errors";

export interface AlgorandConfig {
  network: string;
  algodServer: string;
  algodToken: string;
  algodPort: number;
  usdcAssetId: number;
  facilitatorUrl: string;
  walletMnemonic?: string;
}

export const getAlgorandConfig = (): AlgorandConfig => {
  const mode = env.PAYMENT_MODE;
  const network = env.NETWORK;
  const algodServer = env.ALGOD_SERVER;
  const algodToken = env.ALGOD_TOKEN;
  const algodPort = env.ALGOD_PORT;
  const usdcAssetId = env.USDC_ASSET_ID;
  const facilitatorUrl = env.X402_FACILITATOR_URL;
  const walletMnemonic = env.WALLET_MNEMONIC;

  if (mode === "live") {
    if (!algodServer) {
      throw new WalletConfigurationError("Missing required configuration: ALGOD_SERVER");
    }
    if (!facilitatorUrl) {
      throw new WalletConfigurationError("Missing required configuration: X402_FACILITATOR_URL");
    }
  }

  return {
    network,
    algodServer,
    algodToken,
    algodPort,
    usdcAssetId,
    facilitatorUrl,
    walletMnemonic,
  };
};
