import { ITransport, HttpRequestOptions, HttpResponse } from "../interfaces/x402.interface";
import { TransportMiddlewarePipeline } from "./middleware.pipeline";
import { TransportError, RetryExceededError } from "../errors/x402.errors";
import { logger } from "../../../utils/logger";

export class HttpTransport implements ITransport {
  private pipeline: TransportMiddlewarePipeline;
  private maxRetries: number;
  private initialBackoffMs: number;

  constructor(maxRetries = 3, initialBackoffMs = 100) {
    this.pipeline = new TransportMiddlewarePipeline();
    this.maxRetries = maxRetries;
    this.initialBackoffMs = initialBackoffMs;
  }

  public getPipeline(): TransportMiddlewarePipeline {
    return this.pipeline;
  }

  async request<T = any>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    const preparedOptions = this.pipeline.executeRequestPipeline(options);
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      try {
        const response = await this.executeFetch<T>(preparedOptions);
        return this.pipeline.executeResponsePipeline(response);
      } catch (err: any) {
        const status = err.statusCode || err.status || 500;

        // Do NOT retry non-retryable status codes (e.g., 402, 401, 403, 404)
        const isRetryable = status === 429 || status === 408 || status >= 500;

        if (!isRetryable || attempt >= this.maxRetries) {
          if (attempt >= this.maxRetries && isRetryable) {
            throw new RetryExceededError(this.maxRetries);
          }
          throw err;
        }

        attempt++;
        const delay = this.initialBackoffMs * Math.pow(2, attempt - 1);
        logger.warn(
          `⚠️ Transport HTTP ${status} error. Retrying attempt ${attempt}/${this.maxRetries} in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new RetryExceededError(this.maxRetries);
  }

  private async executeFetch<T>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    // Standard mock/fetch simulation engine for x402 endpoints
    const timeoutMs = options.timeoutMs || 10000;
    const isLocalSimulatedUrl = options.url.includes("x402.io") || options.url.startsWith("http://localhost");

    if (isLocalSimulatedUrl) {
      // Simulate HTTP 402 Challenge on first request without Authorization header
      const authHeader = options.headers?.["Authorization"] || options.headers?.["authorization"];

      if (!authHeader) {
        throw new TransportError("HTTP 402 Payment Required", 402);
      }

      // Valid authorization header present -> return 200 OK simulated response
      return {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-402-receipt-id": `rcpt_x402_${Date.now()}`,
          "x-402-tx-hash": `0x402${Math.random().toString(16).substring(2, 40)}`,
        },
        data: {
          success: true,
          data: {
            result: "Mocked x402 Paid Micro-Service Payload Data",
            timestamp: new Date().toISOString(),
          },
        } as unknown as T,
      };
    }

    throw new TransportError(`Endpoint ${options.url} unresolvable`, 404);
  }
}

export const httpTransport = new HttpTransport();
