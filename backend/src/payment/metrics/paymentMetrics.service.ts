export interface PaymentMetricsSnapshot {
  totalPayments: number;
  approvedPayments: number;
  deniedPayments: number;
  failedPayments: number;
  totalVolume: number;
  avgLatencyMs: number;
}

export class PaymentMetricsService {
  private static instance: PaymentMetricsService;
  private totalPayments = 0;
  private approvedPayments = 0;
  private deniedPayments = 0;
  private failedPayments = 0;
  private totalVolume = 0;
  private totalLatencyMs = 0;

  private constructor() {}

  public static getInstance(): PaymentMetricsService {
    if (!PaymentMetricsService.instance) {
      PaymentMetricsService.instance = new PaymentMetricsService();
    }
    return PaymentMetricsService.instance;
  }

  public recordPaymentAttempt(): void {
    this.totalPayments++;
  }

  public recordPaymentSuccess(amount: number, latencyMs: number): void {
    this.approvedPayments++;
    this.totalVolume += amount;
    this.totalLatencyMs += latencyMs;
  }

  public recordPaymentDenial(): void {
    this.deniedPayments++;
  }

  public recordPaymentFailure(): void {
    this.failedPayments++;
  }

  public getSnapshot(): PaymentMetricsSnapshot {
    const avgLatencyMs =
      this.approvedPayments > 0 ? Math.round(this.totalLatencyMs / this.approvedPayments) : 0;
    return {
      totalPayments: this.totalPayments,
      approvedPayments: this.approvedPayments,
      deniedPayments: this.deniedPayments,
      failedPayments: this.failedPayments,
      totalVolume: Number(this.totalVolume.toFixed(4)),
      avgLatencyMs,
    };
  }
}

export const paymentMetricsService = PaymentMetricsService.getInstance();
