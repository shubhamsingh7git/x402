import { AbstractPaymentProvider } from "../../providers/AbstractPaymentProvider";
import { PaymentContext } from "../../dto/paymentContext";
import { PaymentResultDTO } from "../../dto/paymentResult.dto";
import { x402Client, X402Client } from "../client/X402Client";

export class X402PaymentProvider extends AbstractPaymentProvider {
  readonly providerName = "X402PaymentProvider";
  private client: X402Client;

  constructor(client = x402Client) {
    super();
    this.client = client;
  }

  protected async executePayment(context: PaymentContext, _startTime: number): Promise<PaymentResultDTO> {
    return this.client.executeProtocol(context);
  }
}

export const x402PaymentProvider = new X402PaymentProvider();
