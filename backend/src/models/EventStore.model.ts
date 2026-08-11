import mongoose, { Schema, Document } from "mongoose";

export interface IEventStoreDoc extends Document {
  eventId: string;
  domain: string;
  eventName: string;
  payload: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const EventStoreSchema = new Schema<IEventStoreDoc>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const EventStoreModel = mongoose.model<IEventStoreDoc>("EventStore", EventStoreSchema);
