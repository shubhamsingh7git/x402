export const OBSERVABILITY_EVENTS = {
  TRACE_STARTED: "observability:traceStarted",
  TRACE_COMPLETED: "observability:traceCompleted",
  METRIC_UPDATED: "observability:metricUpdated",
  HEALTH_CHANGED: "observability:healthChanged",
  ALERT_CREATED: "observability:alertCreated",
  ALERT_RESOLVED: "observability:alertResolved",
  INCIDENT_OPENED: "observability:incidentOpened",
  INCIDENT_UPDATED: "observability:incidentUpdated",
  INCIDENT_CLOSED: "observability:incidentClosed",
} as const;
