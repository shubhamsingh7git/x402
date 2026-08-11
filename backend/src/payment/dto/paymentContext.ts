import { PaymentRequestDTO } from "./paymentRequest.dto";

export class PaymentContext {
  public paymentId: string;
  public correlationId: string;
  public executionId: string;
  public runId: string;
  public stepId?: number;

  public merchantId: string;
  public serviceId?: string;
  public network: string;
  public asset: string;
  public amount: number;
  public currency: string;
  public scheme: string;
  public endpoint?: string;

  public state: string;
  public requestTime: Date;
  public metadata: Record<string, unknown>;

  constructor(dto: PaymentRequestDTO) {
    this.paymentId = `pmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.executionId = dto.executionId || dto.runId || `exec_${Date.now()}`;
    this.runId = dto.runId || dto.executionId || `run_${Date.now()}`;
    this.stepId = dto.stepId;
    this.correlationId = `corr_${this.runId}_${this.stepId || 0}_${Date.now()}`;

    this.merchantId = dto.merchantId;
    this.serviceId = dto.serviceId;
    this.network = dto.network || "Base Sepolia Testnet";
    this.asset = dto.asset || "USDC";
    this.amount = dto.price;
    this.currency = dto.asset || "USDC";
    this.scheme = dto.scheme || "Exact";
    this.endpoint = dto.endpoint;

    this.state = "CREATED";
    this.requestTime = new Date();
    this.metadata = {
      ...dto.metadata,
      paymentId: this.paymentId,
      correlationId: this.correlationId,
      runId: this.runId,
      stepId: this.stepId,
    };
  }
}
