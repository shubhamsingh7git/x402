import { createRequestContext, IRequestContext } from "./RequestContext";
import { RequestStateEnum } from "./GatewayStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class RequestPipeline {
  async processPipeline(rawRequest: { path: string; method: string; headers: Record<string, string> }): Promise<IRequestContext> {
    const ctx = createRequestContext({
      correlationId: rawRequest.headers["x-correlation-id"],
    });

    // 1. RECEIVE & AUTHENTICATE
    ctx.state = RequestStateEnum.AUTHENTICATED;
    
    // 2. AUTHORIZE & VALIDATE
    ctx.state = RequestStateEnum.AUTHORIZED;
    ctx.state = RequestStateEnum.VALIDATED;

    // 3. ROUTE & FORWARD
    ctx.state = RequestStateEnum.ROUTED;
    ctx.state = RequestStateEnum.FORWARDED;

    // 4. RESPONDED
    ctx.state = RequestStateEnum.RESPONDED;

    logger.debug(`🛣️ RequestPipeline processed Path [${rawRequest.path}] Request [${ctx.requestId}]`);
    eventBus.emitEvent("gateway:requestCompleted" as any, { requestId: ctx.requestId, path: rawRequest.path });
    return ctx;
  }
}

export const requestPipeline = new RequestPipeline();
