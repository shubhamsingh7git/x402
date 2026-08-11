import mongoose, { Schema, Document } from "mongoose";

export interface ITimelineEventDocument extends Document {
  runId: string;
  stepId?: number;
  event: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const timelineEventSchema = new Schema<ITimelineEventDocument>(
  {
    runId: {
      type: String,
      required: true,
      index: true,
    },
    stepId: {
      type: Number,
    },
    event: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

timelineEventSchema.index({ runId: 1, timestamp: 1 });

export const TimelineEvent = mongoose.model<ITimelineEventDocument>("TimelineEvent", timelineEventSchema);
