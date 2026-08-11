import { IExecutionStrategy } from "./ExecutionStrategy";
import { ExecutionStrategyType } from "./ExecutionTypes";
import { SequentialExecutionStrategy } from "./SequentialExecutionStrategy";
import { ParallelExecutionStrategy } from "./ParallelExecutionStrategy";
import { BalancedExecutionStrategy } from "./BalancedExecutionStrategy";
import { ConsensusExecutionStrategy } from "./ConsensusExecutionStrategy";

export class ExecutionStrategyFactory {
  static getStrategy(type?: ExecutionStrategyType): IExecutionStrategy {
    switch (type) {
      case "PARALLEL":
      case "FASTEST":
        return new ParallelExecutionStrategy();
      case "CONSENSUS":
      case "QUORUM":
        return new ConsensusExecutionStrategy();
      case "BALANCED":
      case "CHEAPEST":
      case "HIGHEST_TRUST":
        return new BalancedExecutionStrategy();
      case "SEQUENTIAL":
      default:
        return new SequentialExecutionStrategy();
    }
  }
}
