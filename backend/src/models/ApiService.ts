import mongoose, { Schema, Document } from "mongoose";

export interface IApiServiceDocument extends Document {
  serviceName: string;
  endpoint: string;
  price: number;
  merchant: string;
  network: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const apiServiceSchema = new Schema<IApiServiceDocument>(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    endpoint: {
      type: String,
      required: [true, "Endpoint is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    merchant: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ApiService = mongoose.model<IApiServiceDocument>("ApiService", apiServiceSchema);
