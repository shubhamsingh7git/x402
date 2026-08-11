import mongoose, { Schema, Document } from "mongoose";

export interface ISLAProfile extends Document {
  providerId: string;
  uptimePercentage: number;
  maxLatencyMs: number;
  guaranteedAvailability: string;
  monthlyQuota: number;
  supportLevel: "COMMUNITY" | "STANDARD" | "ENTERPRISE_247";
  createdAt: Date;
  updatedAt: Date;
}

const SLAProfileSchema = new Schema<ISLAProfile>(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    uptimePercentage: {
      type: Number,
      default: 99.9,
    },
    maxLatencyMs: {
      type: Number,
      default: 200,
    },
    guaranteedAvailability: {
      type: String,
      default: "99.9% Uptime",
    },
    monthlyQuota: {
      type: Number,
      default: 100000,
    },
    supportLevel: {
      type: String,
      enum: ["COMMUNITY", "STANDARD", "ENTERPRISE_247"],
      default: "STANDARD",
    },
  },
  {
    timestamps: true,
  }
);

export const SLAProfile = mongoose.model<ISLAProfile>("SLAProfile", SLAProfileSchema);
