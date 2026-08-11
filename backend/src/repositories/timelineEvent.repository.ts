import { TimelineEvent, ITimelineEventDocument } from "../models/TimelineEvent";

export class TimelineEventRepository {
  async create(data: Partial<ITimelineEventDocument>): Promise<ITimelineEventDocument> {
    return TimelineEvent.create(data);
  }

  async findByRunId(runId: string): Promise<ITimelineEventDocument[]> {
    return TimelineEvent.find({ runId }).sort({ timestamp: 1 });
  }

  async deleteByRunId(runId: string): Promise<void> {
    await TimelineEvent.deleteMany({ runId });
  }
}

export const timelineEventRepository = new TimelineEventRepository();
