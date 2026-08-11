import { autoscalingRepository } from "../repositories/AutoscalingRepository";

export class Autoscaler {
  async getPolicies() {
    return autoscalingRepository.find(50);
  }
}

export const autoscaler = new Autoscaler();
