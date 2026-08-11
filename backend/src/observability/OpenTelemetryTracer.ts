import { ITracer } from "./ITracer";
import { traceRepository } from "../repositories/TraceRepository";
import { spanRepository } from "../repositories/SpanRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class OpenTelemetryTracer implements ITracer {
  async startTrace(rootSpanName: string, serviceName = "api-gateway") {
    const traceId = `trc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const rootSpanId = `spn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    await traceRepository.create({
      traceId,
      rootSpanName,
      serviceName,
      status: "OK",
      durationMs: 0,
      spansCount: 1,
    });

    await spanRepository.create({
      spanId: rootSpanId,
      traceId,
      name: rootSpanName,
      serviceName,
      durationMs: 0,
      tags: { isRoot: "true" } as any,
    });

    logger.debug(`🔭 OpenTelemetryTracer started Trace [${traceId}] RootSpan: '${rootSpanName}'`);
    eventBus.emitEvent("observability:traceStarted" as any, { traceId, rootSpanName });
    return { traceId, rootSpanId };
  }

  async startSpan(traceId: string, name: string, parentSpanId?: string) {
    const spanId = `spn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await spanRepository.create({
      spanId,
      traceId,
      parentSpanId,
      name,
      serviceName: "microservice",
      durationMs: 0,
      tags: {} as any,
    });
    return { spanId };
  }

  async finishSpan(spanId: string, durationMs: number, tags: Record<string, string> = {}) {
    logger.debug(`🏁 OpenTelemetryTracer finished Span [${spanId}] duration: ${durationMs}ms`);
  }

  async finishTrace(traceId: string, status = "OK") {
    const trace = await traceRepository.findByTraceId(traceId);
    if (trace) {
      trace.status = status;
      await trace.save();
      eventBus.emitEvent("observability:traceCompleted" as any, trace as any);
    }
  }
}

export const openTelemetryTracer = new OpenTelemetryTracer();
