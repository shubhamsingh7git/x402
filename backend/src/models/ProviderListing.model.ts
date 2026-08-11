import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProviderListing extends Document {
  providerId: string;
  merchantId: Types.ObjectId;
  serviceId?: Types.ObjectId | string;
  capabilities: string[];
  supportedNetworks: string[];
  pricePerCall: number;
  currency: string;
  availability: boolean;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "DEPRECATED";
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderListingSchema = new Schema<IProviderListing>(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },
    serviceId: {
      type: Schema.Types.Mixed,
      ref: "ApiService",
      required: false,
      index: true,
    },
    capabilities: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },
    supportedNetworks: {
      type: [String],
      default: ["Base Sepolia Testnet"],
      index: true,
    },
    pricePerCall: {
      type: Number,
      required: true,
      min: 0,
      default: 0.01,
      index: true,
    },
    currency: {
      type: String,
      default: "USDC",
    },
    availability: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "MAINTENANCE", "DEPRECATED"],
      default: "ACTIVE",
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ProviderListingSchema.index({ capabilities: 1, status: 1, availability: 1 });
ProviderListingSchema.index({ merchantId: 1, serviceId: 1 });

export const ProviderListing = mongoose.model<IProviderListing>("ProviderListing", ProviderListingSchema);
