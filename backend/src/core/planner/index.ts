/**
 * Core Planner Module
 *
 * Future home of the AI planning engine (Claude/GPT integration).
 * Responsible for:
 *   - Decomposing user queries into research sub-tasks
 *   - Determining which API services to query
 *   - Generating execution plans
 *
 * Will emit: AGENT_START, AGENT_STEP events via EventBus
 */

export class Planner {
  async createPlan(_query: string): Promise<void> {
    // Stub — AI integration goes here in future milestones
  }
}

export const planner = new Planner();
