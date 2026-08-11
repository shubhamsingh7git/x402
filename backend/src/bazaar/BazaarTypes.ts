export interface IBazaarProviderListing {
  _id?: string;
  providerId: string;
  merchantId: any;
  serviceId?: any;
  capabilities: string[];
  supportedNetworks: string[];
  pricePerCall: number;
  currency: string;
  availability: boolean;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "DEPRECATED";
  metadata?: Record<string, unknown>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IBazaarCapability {
  _id?: string;
  name: string;
  displayName: string;
  description: string;
  category: "FINANCE" | "DATA" | "AI" | "UTILITY" | "SECURITY" | "ANALYTICS";
  tags: string[];
  version: string;
  status: "ACTIVE" | "DEPRECATED";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IBazaarSearchParams {
  capability?: string;
  network?: string;
  merchantId?: string;
  status?: string;
  availability?: boolean;
  merchantVerifiedOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "rank" | "latency" | "price" | "trust" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface IBazaarRankedCandidate {
  listing: IBazaarProviderListing;
  merchant: {
    id: string;
    alias: string;
    walletAddress: string;
    status: string;
    isVerified: boolean;
    trustScore: number;
  };
  metrics: {
    verificationScore: number;
    trustScore: number;
    latencyMs: number;
    successRate: number;
    compositeScore: number;
  };
}

export interface IBazaarOverviewMetrics {
  totalProviders: number;
  healthyProviders: number;
  offlineProviders: number;
  activeCapabilities: number;
  averageTrustScore: number;
  averageLatencyMs: number;
  latestActivity?: {
    action: string;
    timestamp: Date | string;
  } | null;
}
