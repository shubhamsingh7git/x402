import mongoose, { Schema, Document } from "mongoose";

export interface IThreatEventDoc extends Document {
  threatId: string;
  threatType: string;
  severity: string;
  ipAddress: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ThreatEventSchema = new Schema<IThreatEventDoc>(
  {
    threatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    threatType: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      default: "HIGH",
    },
    ipAddress: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

export const ThreatEventModel = mongoose.model<IThreatEventDoc>("ThreatEvent", ThreatEventSchema);
