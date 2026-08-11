import mongoose, { Schema, Document } from "mongoose";
import { RegionalAvailabilityStatusEnum } from "../production/ProductionStatus";

export interface IRegionDoc extends Document {
  regionId: string;
  name: string;
  code: string;
  isPrimary: boolean;
  status: RegionalAvailabilityStatusEnum;
  latencyMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const RegionSchema = new Schema<IRegionDoc>(
  {
    regionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(RegionalAvailabilityStatusEnum),
      default: RegionalAvailabilityStatusEnum.ACTIVE,
      index: true,
    },
    latencyMs: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

export const RegionModel = mongoose.model<IRegionDoc>("Region", RegionSchema);
