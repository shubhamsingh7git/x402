import { HealthStatusEnum } from "./HealthStatus";
import { AlertSeverityEnum } from "./AlertSeverity";
import { IncidentStatusEnum } from "./IncidentStatus";

export interface ISpanDTO {
  spanId: string;
  parentSpanId?: string;
  name: string;
  serviceName: string;
  durationMs: number;
  tags: Record<string, string>;
  createdAt?: string | Date;
}

export interface ITraceDTO {
  id?: string;
  traceId: string;
  rootSpanName: string;
  serviceName: string;
  status: "OK" | "ERROR" | string;
  durationMs: number;
  spansCount: number;
  createdAt?: string | Date;
}

export interface IMetricDTO {
  id?: string;
  metricName: string;
  metricType: "GAUGE" | "COUNTER" | "HISTOGRAM" | string;
  value: number;
  serviceName: string;
  tags: Record<string, string>;
  createdAt?: string | Date;
}

export interface ILogEntryDTO {
  id?: string;
  logId: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "AUDIT" | "SECURITY" | string;
  message: string;
  serviceName: string;
  traceId?: string;
  correlationId?: string;
  createdAt?: string | Date;
}

export interface IAlertRuleDTO {
  id?: string;
  ruleId: string;
  ruleName: string;
  targetMetric: string;
  threshold: number;
  severity: AlertSeverityEnum;
  enabled: boolean;
  createdAt?: string | Date;
}

export interface IAlertDTO {
  id?: string;
  alertId: string;
  ruleId?: string;
  title: string;
  severity: AlertSeverityEnum;
  status: "ACTIVE" | "RESOLVED" | "ACKNOWLEDGED" | string;
  serviceName: string;
  message: string;
  createdAt?: string | Date;
}

export interface IIncidentDTO {
  id?: string;
  incidentId: string;
  title: string;
  severity: AlertSeverityEnum;
  status: IncidentStatusEnum;
  affectedServices: string[];
  rootCause?: string;
  openedAt?: string | Date;
  resolvedAt?: string | Date;
  createdAt?: string | Date;
}

export interface ISloRecordDTO {
  serviceName: string;
  sloTargetPercent: number;
  currentAvailabilityPercent: number;
  errorBudgetRemainingPercent: number;
  mttrMinutes: number;
}

export interface IObservabilityAnalyticsDTO {
  healthyServices: number;
  degradedServices: number;
  activeAlerts: number;
  criticalAlerts: number;
  openIncidents: number;
  activeTraces: number;
  logsPerMinute: number;
  averageLatencyMs: number;
  availability: number;
  errorRate: number;
}
