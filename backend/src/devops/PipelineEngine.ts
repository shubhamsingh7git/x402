import { pipelineRepository } from "../repositories/PipelineRepository";
import { eventBus } from "../events/eventBus";

export class PipelineEngine {
  async getPipelines() {
    return pipelineRepository.findPipelines();
  }
}

export const pipelineEngine = new PipelineEngine();
