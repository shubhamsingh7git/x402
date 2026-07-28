import { create } from "zustand"

export interface Merchant {
  id: string
  alias: string
  address: string
  network: string
  status: "Verified" | "Pending" | "Blocked"
  addedAt: string
}

export interface AuditLogItem {
  id: string
  timestamp: string
  targetService: string
  network: string
  scheme: "Exact" | "Upto" | "Batch"
  amountRequested: number
  policyDecision: "Approved" | "Denied"
  rejectionReason: string
  txHash: string
}

interface AppState {
  // CDP & Wallet State
  isCdpConnected: boolean
  cdpApiKeyId: string
  cdpApiKeySecret: string
  selectedNetwork: "Base Sepolia Testnet" | "Base Mainnet"
  sessionWalletAddress: string
  usdcBalance: number

  // Policy Guard State
  killSwitchActive: boolean
  maxPerTxAmount: number
  dailyBudgetLimit: number
  maxTxPerMinute: number
  merchants: Merchant[]

  // Audit Logs
  auditLogs: AuditLogItem[]

  // Actions
  initializeCdp: (apiKeyId: string, apiKeySecret: string, network: "Base Sepolia Testnet" | "Base Mainnet") => Promise<void>
  disconnectCdp: () => void
  toggleKillSwitch: () => void
  setKillSwitch: (active: boolean) => void
  setMaxPerTxAmount: (amount: number) => void
  setDailyBudgetLimit: (limit: number) => void
  setMaxTxPerMinute: (rate: number) => void
  addMerchant: (merchant: Omit<Merchant, "id" | "addedAt">) => void
  deleteMerchant: (id: string) => void
  addAuditLog: (log: Omit<AuditLogItem, "id">) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Default CDP & Session Wallet State
  isCdpConnected: true,
  cdpApiKeyId: "cdp_key_8f92a1b3c4d5",
  cdpApiKeySecret: "••••••••••••••••",
  selectedNetwork: "Base Sepolia Testnet",
  sessionWalletAddress: "0x7F2A8492B1039E82C41A3B92",
  usdcBalance: 250.0,

  // Policy Guard State
  killSwitchActive: false,
  maxPerTxAmount: 0.05,
  dailyBudgetLimit: 10.0,
  maxTxPerMinute: 30,
  merchants: [
    { id: "mch-1", alias: "Legal Sandbox API", address: "eip155:84532:0x3F82...19A2", network: "Base Sepolia Testnet", status: "Verified", addedAt: "2026-07-20" },
    { id: "mch-2", alias: "Deceptive Pattern DB", address: "eip155:84532:0x9C10...D4E8", network: "Base Sepolia Testnet", status: "Verified", addedAt: "2026-07-22" },
    { id: "mch-3", alias: "CoinGecko Pro API", address: "eip155:84532:0x7A4B...99F1", network: "Base Sepolia Testnet", status: "Verified", addedAt: "2026-07-25" },
    { id: "mch-4", alias: "Unverified Vendor X", address: "eip155:84532:0x1122...3344", network: "Base Sepolia Testnet", status: "Blocked", addedAt: "2026-07-26" },
  ],

  // Default Audit Logs
  auditLogs: [
    {
      id: "LOG-1001",
      timestamp: "2026-07-27 22:15:02.104",
      targetService: "https://api.legalsandbox.gov/v1/dpdp",
      network: "eip155:84532",
      scheme: "Exact",
      amountRequested: 0.02,
      policyDecision: "Approved",
      rejectionReason: "N/A - Compliant with threshold",
      txHash: "0x8f92a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    },
    {
      id: "LOG-1002",
      timestamp: "2026-07-27 22:14:48.330",
      targetService: "https://api.deceptivepattern.org/taxonomy",
      network: "eip155:84532",
      scheme: "Exact",
      amountRequested: 0.04,
      policyDecision: "Approved",
      rejectionReason: "N/A - Compliant with threshold",
      txHash: "0x3e6d8a7b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
    },
    {
      id: "LOG-1003",
      timestamp: "2026-07-27 22:10:12.802",
      targetService: "https://api.unverifiedvendor.io/data",
      network: "eip155:84532",
      scheme: "Upto",
      amountRequested: 0.15,
      policyDecision: "Denied",
      rejectionReason: "Exceeds max transaction cap ($0.05 USDC)",
      txHash: "0x0000000000000000000000000000000000000000",
    },
    {
      id: "LOG-1004",
      timestamp: "2026-07-27 21:55:04.619",
      targetService: "https://pro-api.coingecko.com/v3/coins",
      network: "eip155:84532",
      scheme: "Batch",
      amountRequested: 0.05,
      policyDecision: "Approved",
      rejectionReason: "N/A - Compliant with threshold",
      txHash: "0x11223344556677889900aabbccddeeff00112233",
    },
    {
      id: "LOG-1005",
      timestamp: "2026-07-27 21:30:19.450",
      targetService: "https://blocked-merchant.net/v1/query",
      network: "eip155:84532",
      scheme: "Exact",
      amountRequested: 0.01,
      policyDecision: "Denied",
      rejectionReason: "Address not in Allowlist",
      txHash: "0x0000000000000000000000000000000000000000",
    },
  ],

  // Actions
  initializeCdp: async (apiKeyId, apiKeySecret, network) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const randomWallet = `0x7F2A${Math.floor(1000 + Math.random() * 9000)}B1039E82C41A3B92`
    set({
      isCdpConnected: true,
      cdpApiKeyId: apiKeyId,
      cdpApiKeySecret: apiKeySecret,
      selectedNetwork: network,
      sessionWalletAddress: randomWallet,
      usdcBalance: 250.0,
    })
  },

  disconnectCdp: () => set({ isCdpConnected: false }),
  toggleKillSwitch: () => set((state) => ({ killSwitchActive: !state.killSwitchActive })),
  setKillSwitch: (active) => set({ killSwitchActive: active }),
  setMaxPerTxAmount: (amount) => set({ maxPerTxAmount: amount }),
  setDailyBudgetLimit: (limit) => set({ dailyBudgetLimit: limit }),
  setMaxTxPerMinute: (rate) => set({ maxTxPerMinute: rate }),
  addMerchant: (merchant) =>
    set((state) => ({
      merchants: [
        {
          ...merchant,
          id: `mch-${Date.now()}`,
          addedAt: new Date().toISOString().split("T")[0],
        },
        ...state.merchants,
      ],
    })),
  deleteMerchant: (id) =>
    set((state) => ({
      merchants: state.merchants.filter((m) => m.id !== id),
    })),
  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [{ ...log, id: `LOG-${Date.now()}` }, ...state.auditLogs],
    })),
}))
