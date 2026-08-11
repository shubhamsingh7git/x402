import { LogEntryModel, ILogEntryDoc } from "../models/LogEntry.model";

export class LogRepository {
  async save(data: Partial<ILogEntryDoc>): Promise<ILogEntryDoc> {
    const doc = new LogEntryModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<ILogEntryDoc[]> {
    return LogEntryModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return LogEntryModel.countDocuments().exec();
  }
}

export const logRepository = new LogRepository();
