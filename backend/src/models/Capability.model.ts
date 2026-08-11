import mongoose, { Schema, Document } from "mongoose";

export interface ICapability extends Document {
  name: string;
  displayName: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  status: "ACTIVE" | "DEPRECATED";
  createdAt: Date;
  updatedAt: Date;
}

const CapabilitySchema = new Schema<ICapability>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["FINANCE", "DATA", "AI", "UTILITY", "SECURITY", "ANALYTICS"],
      default: "UTILITY",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DEPRECATED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CapabilitySchema.index({ name: "text", displayName: "text", description: "text", tags: "text" });

export const Capability = mongoose.model<ICapability>("Capability", CapabilitySchema);
