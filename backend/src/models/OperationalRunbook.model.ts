import mongoose, { Schema, Document } from "mongoose";

export interface IOperationalRunbookDoc extends Document {
  runbookId: string;
  title: string;
  service: string;
  ownerTeam: string;
  stepsCount: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OperationalRunbookSchema = new Schema<IOperationalRunbookDoc>(
  {
    runbookId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    ownerTeam: {
      type: String,
      default: "SRE Platform Team",
    },
    stepsCount: {
      type: Number,
      default: 6,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const OperationalRunbookModel = mongoose.model<IOperationalRunbookDoc>("OperationalRunbook", OperationalRunbookSchema);
