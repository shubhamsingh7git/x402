import { deploymentRepository } from "../repositories/DeploymentRepository";
import { DeploymentStatusEnum } from "./ClusterStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class DeploymentManager {
  async triggerDeployment(deploymentId: string, imageTag: string) {
    const deployment = await deploymentRepository.save({
      deploymentId,
      imageTag,
      status: DeploymentStatusEnum.RUNNING,
    });

    logger.info(`🚀 DeploymentManager started rollout for [${deploymentId}] imageTag: ${imageTag}`);
    eventBus.emitEvent("devops:deploymentStarted" as any, deployment as any);
    return deployment;
  }

  async rollbackDeployment(deploymentId: string) {
    const deployment = await deploymentRepository.save({
      deploymentId,
      status: DeploymentStatusEnum.ROLLING_BACK,
    });

    logger.warn(`⏪ DeploymentManager initiated rollback for [${deploymentId}]`);
    eventBus.emitEvent("devops:rollbackStarted" as any, deployment as any);
    return deployment;
  }

  async getDeployments() {
    return deploymentRepository.find(50);
  }
}

export const deploymentManager = new DeploymentManager();
