import { HttpRequestOptions, HttpResponse } from "../interfaces/x402.interface";
import { logger } from "../../../utils/logger";

export type TransportRequestMiddleware = (options: HttpRequestOptions) => HttpRequestOptions;
export type TransportResponseMiddleware = (response: HttpResponse) => HttpResponse;

export class TransportMiddlewarePipeline {
  private requestMiddlewares: TransportRequestMiddleware[] = [];
  private responseMiddlewares: TransportResponseMiddleware[] = [];

  constructor() {
    this.useDefaultLoggingAndTracing();
  }

  private useDefaultLoggingAndTracing(): void {
    // 1. Tracing & Header Middleware
    this.useRequest((options) => {
      options.headers = {
        "User-Agent": "x402-Agentic-Commerce-Client/1.0",
        "Accept": "application/json",
        "x-402-version": "1.0",
        ...options.headers,
      };
      return options;
    });

    // 2. Logging Middleware
    this.useRequest((options) => {
      logger.debug({ method: options.method, url: options.url }, `🌐 HTTP Request Outbound`);
      return options;
    });

    this.useResponse((res) => {
      logger.debug({ status: res.status, statusText: res.statusText }, `🌐 HTTP Response Inbound`);
      return res;
    });
  }

  public useRequest(mw: TransportRequestMiddleware): void {
    this.requestMiddlewares.push(mw);
  }

  public useResponse(mw: TransportResponseMiddleware): void {
    this.responseMiddlewares.push(mw);
  }

  public executeRequestPipeline(options: HttpRequestOptions): HttpRequestOptions {
    let current = { ...options };
    for (const mw of this.requestMiddlewares) {
      current = mw(current);
    }
    return current;
  }

  public executeResponsePipeline(response: HttpResponse): HttpResponse {
    let current = { ...response };
    for (const mw of this.responseMiddlewares) {
      current = mw(current);
    }
    return current;
  }
}
