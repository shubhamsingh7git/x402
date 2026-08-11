import { ScheduledTaskModel, IScheduledTaskDoc } from "../models/ScheduledTask.model";

export class ScheduledTaskRepository {
  async upsert(data: Partial<IScheduledTaskDoc>): Promise<IScheduledTaskDoc> {
    return ScheduledTaskModel.findOneAndUpdate(
      { taskId: data.taskId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IScheduledTaskDoc>;
  }

  async find(limit = 50): Promise<IScheduledTaskDoc[]> {
    return ScheduledTaskModel.find({}).sort({ taskId: 1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return ScheduledTaskModel.countDocuments().exec();
  }
}

export const scheduledTaskRepository = new ScheduledTaskRepository();
