import { timelineEventRepository } from "../../repositories/timelineEvent.repository";
import { eventBus } from "../../events/eventBus";
import { EVENTS, TimelineEventName } from "../../constants/events";
import { logger } from "../../utils/logger";

export class TimelineService {
  async recordEvent(
    runId: string,
    event: TimelineEventName | string,
    stepId?: number,
    metadata: Record<string, unknown> = {}
  ) {
    const timelineItem = await timelineEventRepository.create({
      runId,
      stepId,
      event,
      timestamp: new Date(),
      metadata,
    });

    logger.debug(`⏱️ Timeline event [${event}] recorded for runId: ${runId}`);

    // Emit live timeline update via EventBus -> Socket.IO
    eventBus.emitEvent(EVENTS.TIMELINE_UPDATE, {
      runId,
      stepId,
      event,
      timestamp: timelineItem.timestamp,
      metadata,
    });

    return timelineItem;
  }

  async getTimelineForRun(runId: string) {
    return timelineEventRepository.findByRunId(runId);
  }
}

export const timelineService = new TimelineService();
