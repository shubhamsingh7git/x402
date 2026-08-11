import { QueueModel, IQueueDoc } from "../models/Queue.model";

export class QueueRepository {
  async upsert(data: Partial<IQueueDoc>): Promise<IQueueDoc> {
    return QueueModel.findOneAndUpdate(
      { queueName: data.queueName },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IQueueDoc>;
  }

  async find(limit = 50): Promise<IQueueDoc[]> {
    return QueueModel.find({}).sort({ queueName: 1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return QueueModel.countDocuments().exec();
  }
}

export const queueRepository = new QueueRepository();
