import mongoose, { Schema, Document } from "mongoose";

export interface IArtifactSignatureDoc extends Document {
  signatureId: string;
  imageRef: string;
  signerIdentity: string;
  algorithm: string;
  isVerified: boolean;
  signedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArtifactSignatureSchema = new Schema<IArtifactSignatureDoc>(
  {
    signatureId: {
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
    signerIdentity: {
      type: String,
      required: true,
    },
    algorithm: {
      type: String,
      default: "ECDSA_P256_SHA256",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    signedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ArtifactSignatureModel = mongoose.model<IArtifactSignatureDoc>("ArtifactSignature", ArtifactSignatureSchema);
