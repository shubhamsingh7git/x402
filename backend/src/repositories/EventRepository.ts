import { EventStoreModel, IEventStoreDoc } from "../models/EventStore.model";

export class EventRepository {
  async save(data: Partial<IEventStoreDoc>): Promise<IEventStoreDoc> {
    const doc = new EventStoreModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<IEventStoreDoc[]> {
    return EventStoreModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }
}

export const eventRepository = new EventRepository();
