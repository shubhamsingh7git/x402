import mongoose, { Schema, Document } from "mongoose";
import { MarketplaceStatusEnum } from "../marketplace/MarketplaceStatus";

export interface IProviderProfile extends Document {
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
  certifications: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProviderProfileSchema = new Schema<IProviderProfile>(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    merchantAlias: {
      type: String,
      required: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "AI Services",
      index: true,
    },
    capabilities: {
      type: [String],
      default: [],
      index: true,
    },
    logoUrl: {
      type: String,
    },
    website: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    documentationUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(MarketplaceStatusEnum),
      default: MarketplaceStatusEnum.DRAFT,
      index: true,
    },
    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
      index: true,
    },
    supportedRegions: {
      type: [String],
      default: ["GLOBAL"],
    },
    businessVerified: {
      type: Boolean,
      default: false,
    },
    reputationScore: {
      type: Number,
      default: 85.0,
      index: true,
    },
    certifications: {
      type: [String],
      default: ["COMMUNITY"],
    },
  },
  {
    timestamps: true,
  }
);

ProviderProfileSchema.index({ displayName: "text", description: "text" });

export const ProviderProfile = mongoose.model<IProviderProfile>("ProviderProfile", ProviderProfileSchema);
