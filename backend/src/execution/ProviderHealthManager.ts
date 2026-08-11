import { ProviderHealthStatus } from "./ExecutionTypes";
import { circuitBreaker } from "./CircuitBreaker";

interface HealthRecord {
  providerId: string;
  merchantAlias: string;
  totalCalls: number;
  successCalls: number;
  failureCalls: number;
  latencies: number[];
  lastFailureAt?: Date;
  lastSuccessAt?: Date;
}

export class ProviderHealthManager {
  private healthRecords = new Map<string, HealthRecord>();

  recordAttempt(providerId: string, merchantAlias: string, success: boolean, latencyMs: number): void {
    let rec = this.healthRecords.get(providerId);
    if (!rec) {
      rec = {
        providerId,
        merchantAlias,
        totalCalls: 0,
        successCalls: 0,
        failureCalls: 0,
        latencies: [],
      };
    }

    rec.totalCalls += 1;
    if (success) {
      rec.successCalls += 1;
      rec.lastSuccessAt = new Date();
      circuitBreaker.recordSuccess(providerId);
    } else {
      rec.failureCalls += 1;
      rec.lastFailureAt = new Date();
      circuitBreaker.recordFailure(providerId);
    }

    rec.latencies.push(latencyMs);
    if (rec.latencies.length > 50) rec.latencies.shift(); // Rolling 50 calls

    this.healthRecords.set(providerId, rec);
  }

  getHealthStatus(providerId: string, merchantAlias = "Unknown"): ProviderHealthStatus {
    const rec = this.healthRecords.get(providerId);
    const circuitState = circuitBreaker.getCircuitState(providerId);

    if (!rec || rec.totalCalls === 0) {
      return {
        providerId,
        merchantAlias,
        circuitState,
        failureCount: 0,
        rollingSuccessRate: 100.0,
        averageLatencyMs: 120,
      };
    }

    const rollingSuccessRate = Number(((rec.successCalls / rec.totalCalls) * 100).toFixed(1));
    const avgLat = rec.latencies.length
      ? Math.round(rec.latencies.reduce((a, b) => a + b, 0) / rec.latencies.length)
      : 120;

    return {
      providerId,
      merchantAlias: rec.merchantAlias || merchantAlias,
      circuitState,
      failureCount: rec.failureCalls,
      rollingSuccessRate,
      averageLatencyMs: avgLat,
      lastFailureAt: rec.lastFailureAt,
      lastSuccessAt: rec.lastSuccessAt,
    };
  }

  getAllHealthStatuses(): ProviderHealthStatus[] {
    const statuses: ProviderHealthStatus[] = [];
    this.healthRecords.forEach((_, key) => {
      statuses.push(this.getHealthStatus(key));
    });
    return statuses;
  }
}

export const providerHealthManager = new ProviderHealthManager();
