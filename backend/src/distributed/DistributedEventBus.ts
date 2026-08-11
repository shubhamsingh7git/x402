import { eventRepository } from "../repositories/EventRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class DistributedEventBus {
  async publishDomainEvent(domain: string, eventName: string, payload: Record<string, unknown>) {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const doc = await eventRepository.save({
      eventId,
      domain,
      eventName,
      payload: payload as any,
    });

    logger.debug(`📡 DistributedEventBus published [${domain}:${eventName}] (${eventId})`);
    eventBus.emitEvent(`distributed:${eventName}` as any, doc as any);
    return doc;
  }

  async getEvents(limit = 50) {
    return eventRepository.find(limit);
  }
}

export const distributedEventBus = new DistributedEventBus();
