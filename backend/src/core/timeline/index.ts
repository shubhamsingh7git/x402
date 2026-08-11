/**
 * Core Timeline Module
 *
 * Future home of the agent execution timeline/history.
 * Responsible for:
 *   - Recording step-by-step execution history
 *   - Providing chronological audit trail of agent runs
 *   - Feeding the frontend Telemetry Console
 *
 * Will emit: TIMELINE_UPDATE
 */

export class Timeline {
  async recordEvent(_event: Record<string, unknown>): Promise<void> {
    // Stub — timeline recording goes here
  }

  async getTimeline(_runId: string): Promise<Record<string, unknown>[]> {
    // Stub — returns timeline entries for a specific run
    return [];
  }
}

export const timeline = new Timeline();
