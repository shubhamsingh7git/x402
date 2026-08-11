export interface ITracer {
  startTrace(rootSpanName: string, serviceName?: string): Promise<{ traceId: string; rootSpanId: string }>;
  startSpan(traceId: string, name: string, parentSpanId?: string): Promise<{ spanId: string }>;
  finishSpan(spanId: string, durationMs: number, tags?: Record<string, string>): Promise<void>;
  finishTrace(traceId: string, status?: string): Promise<void>;
}
