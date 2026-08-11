import { EventEmitter } from "events";
import { logger } from "../utils/logger";
import { EventName } from "../constants/events";

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emitEvent(event: EventName, payload: Record<string, unknown>): void {
    logger.debug({ event, payload }, `EventBus → ${event}`);
    this.emit(event, payload);
  }

  onEvent(event: EventName, handler: (payload: Record<string, unknown>) => void): void {
    this.on(event, handler);
    logger.debug(`EventBus ← listener registered for ${event}`);
  }
}

export const eventBus = EventBus.getInstance();
