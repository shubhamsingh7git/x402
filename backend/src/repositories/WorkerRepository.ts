import { WorkerModel, IWorkerDoc } from "../models/Worker.model";

export class WorkerRepository {
  async upsert(data: Partial<IWorkerDoc>): Promise<IWorkerDoc> {
    return WorkerModel.findOneAndUpdate(
      { workerId: data.workerId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IWorkerDoc>;
  }

  async findByWorkerId(workerId: string): Promise<IWorkerDoc | null> {
    return WorkerModel.findOne({ workerId }).exec();
  }

  async find(limit = 50): Promise<IWorkerDoc[]> {
    return WorkerModel.find({}).sort({ lastHeartbeat: -1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return WorkerModel.countDocuments(filter).exec();
  }
}

export const workerRepository = new WorkerRepository();
