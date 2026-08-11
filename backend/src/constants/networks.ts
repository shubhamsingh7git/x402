export const NETWORKS = {
  BASE_SEPOLIA: "Base Sepolia Testnet",
  BASE_MAINNET: "Base Mainnet",
  OPTIMISM: "Optimism L2",
  ARBITRUM: "Arbitrum One",
} as const;

export const CHAIN_IDS = {
  BASE_SEPOLIA: "eip155:84532",
  BASE_MAINNET: "eip155:8453",
  OPTIMISM: "eip155:10",
  ARBITRUM: "eip155:42161",
} as const;

export type Network = (typeof NETWORKS)[keyof typeof NETWORKS];
export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];
