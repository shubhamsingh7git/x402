import { MarketplaceStatusEnum } from "./MarketplaceStatus";

export type CertificationBadgeType = "VERIFIED" | "ENTERPRISE" | "OFFICIAL" | "COMMUNITY" | "EXPERIMENTAL";

export interface IProviderProfileDTO {
  id?: string;
  providerId: string;
  merchantAlias: string;
  displayName: string;
  description: string;
  category: string;
  capabilities: string[];
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  documentationUrl?: string;
  status: MarketplaceStatusEnum;
  visibility: "PUBLIC" | "PRIVATE";
  supportedRegions: string[];
  businessVerified: boolean;
  reputationScore: number;
  certifications: CertificationBadgeType[];
  pricingModel?: IPricingPolicyDTO;
  slaProfile?: ISLAProfileDTO;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPricingPolicyDTO {
  id?: string;
  providerId: string;
  tierName: string;
  pricePerCall: number;
  monthlyQuota: number;
  currency: string;
  freeTierCalls: number;
  enterpriseCustomPrice: boolean;
}

export interface ISLAProfileDTO {
  id?: string;
  providerId: string;
  uptimePercentage: number;
  maxLatencyMs: number;
  guaranteedAvailability: string;
  monthlyQuota: number;
  supportLevel: "COMMUNITY" | "STANDARD" | "ENTERPRISE_247";
}

export interface IReviewDTO {
  id?: string;
  reviewId: string;
  providerId: string;
  authorId: string;
  authorAlias: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt?: string | Date;
}

export interface IProviderReputationDTO {
  providerId: string;
  reputationScore: number; // 0 to 100
  averageRating: number;
  reviewCount: number;
  executionSuccessRate: number;
  averageLatencyMs: number;
  slaCompliancePercentage: number;
  verificationBadge: boolean;
  certifiedBadge: boolean;
  lastRecalculatedAt: string | Date;
}

export interface IMarketplaceAnalyticsDTO {
  totalProviders: number;
  verifiedProviders: number;
  certifiedProviders: number;
  activeProviders: number;
  pendingApprovals: number;
  averageRating: number;
  averageLatencyMs: number;
  marketplaceRevenueUsd: number;
  activeSubscriptions: number;
  reviewCount: number;
  topCapabilities: { capability: string; providerCount: number }[];
  providerAvailabilityRate: number;
}
