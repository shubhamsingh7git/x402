import { clusterRepository } from "../repositories/ClusterRepository";
import { eventBus } from "../events/eventBus";

export class ClusterManager {
  async getClusters() {
    return clusterRepository.find(50);
  }
}

export const clusterManager = new ClusterManager();
