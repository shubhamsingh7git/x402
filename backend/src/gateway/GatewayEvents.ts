export const GATEWAY_EVENTS = {
  SERVICE_REGISTERED: "gateway:serviceRegistered",
  SERVICE_REMOVED: "gateway:serviceRemoved",
  REQUEST_STARTED: "gateway:requestStarted",
  REQUEST_COMPLETED: "gateway:requestCompleted",
  REQUEST_FAILED: "gateway:requestFailed",
  ROUTE_RELOADED: "gateway:routeReloaded",
  POLICY_UPDATED: "gateway:policyUpdated",
  HEALTH_CHANGED: "gateway:healthChanged",
} as const;
