import mongoose, { Schema, Document } from "mongoose";

export interface IRouteDefinitionDoc extends Document {
  routeId: string;
  pathPattern: string;
  targetServiceId: string;
  apiVersion: string;
  methods: string[];
  enabled: boolean;
  rateLimitPerMin: number;
  authRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RouteDefinitionSchema = new Schema<IRouteDefinitionDoc>(
  {
    routeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    pathPattern: {
      type: String,
      required: true,
      index: true,
    },
    targetServiceId: {
      type: String,
      required: true,
    },
    apiVersion: {
      type: String,
      default: "v1",
    },
    methods: {
      type: [String],
      default: ["GET", "POST"],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    rateLimitPerMin: {
      type: Number,
      default: 120,
    },
    authRequired: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RouteDefinitionModel = mongoose.model<IRouteDefinitionDoc>("RouteDefinition", RouteDefinitionSchema);
