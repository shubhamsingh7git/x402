import mongoose, { Schema, Document } from "mongoose";

export interface ISbomDoc extends Document {
  sbomId: string;
  imageRef: string;
  componentsCount: number;
  vulnerabilitiesFoundCount: number;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}

const SbomSchema = new Schema<ISbomDoc>(
  {
    sbomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    imageRef: {
      type: String,
      required: true,
      index: true,
    },
    componentsCount: {
      type: Number,
      required: true,
    },
    vulnerabilitiesFoundCount: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: "SPDX",
    },
  },
  {
    timestamps: true,
  }
);

export const SbomModel = mongoose.model<ISbomDoc>("SBOM", SbomSchema);
