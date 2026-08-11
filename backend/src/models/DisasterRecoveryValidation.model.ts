import mongoose, { Schema, Document } from "mongoose";

export interface IDisasterRecoveryValidationDoc extends Document {
  validationId: string;
  rpoActualSeconds: number;
  rtoActualSeconds: number;
  backupIntegrityVerified: boolean;
  status: string;
  testedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DisasterRecoveryValidationSchema = new Schema<IDisasterRecoveryValidationDoc>(
  {
    validationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rpoActualSeconds: {
      type: Number,
      default: 180,
    },
    rtoActualSeconds: {
      type: Number,
      default: 420,
    },
    backupIntegrityVerified: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: "PASSED",
    },
    testedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const DisasterRecoveryValidationModel = mongoose.model<IDisasterRecoveryValidationDoc>("DisasterRecoveryValidation", DisasterRecoveryValidationSchema);
