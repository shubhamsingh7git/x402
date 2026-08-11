import { EXECUTION_CONFIG } from "./ExecutionConfig";
import { logger } from "../utils/logger";

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface ProviderCircuit {
  state: CircuitState;
  failureCount: number;
  lastFailureTime?: number;
  nextAttemptTime?: number;
}

export class CircuitBreaker {
  private circuits = new Map<string, ProviderCircuit>();

  getCircuitState(providerId: string): CircuitState {
    const circuit = this.circuits.get(providerId);
    if (!circuit) return "CLOSED";

    if (circuit.state === "OPEN") {
      if (circuit.nextAttemptTime && Date.now() >= circuit.nextAttemptTime) {
        circuit.state = "HALF_OPEN";
        logger.info(`⚡ CircuitBreaker for provider [${providerId}] switched to HALF_OPEN state`);
        return "HALF_OPEN";
      }
      return "OPEN";
    }

    return circuit.state;
  }

  recordSuccess(providerId: string): void {
    const circuit = this.circuits.get(providerId) || { state: "CLOSED", failureCount: 0 };
    circuit.failureCount = 0;
    circuit.state = "CLOSED";
    this.circuits.set(providerId, circuit);
  }

  recordFailure(providerId: string): void {
    const circuit = this.circuits.get(providerId) || { state: "CLOSED", failureCount: 0 };
    circuit.failureCount += 1;
    circuit.lastFailureTime = Date.now();

    if (circuit.failureCount >= EXECUTION_CONFIG.circuitBreaker.failureThreshold) {
      circuit.state = "OPEN";
      circuit.nextAttemptTime = Date.now() + EXECUTION_CONFIG.circuitBreaker.recoveryTimeMs;
      logger.warn(`🔴 CircuitBreaker for provider [${providerId}] OPENED due to ${circuit.failureCount} consecutive failures`);
    }

    this.circuits.set(providerId, circuit);
  }

  isOpen(providerId: string): boolean {
    return this.getCircuitState(providerId) === "OPEN";
  }
}

export const circuitBreaker = new CircuitBreaker();
