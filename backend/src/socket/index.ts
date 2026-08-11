import { getIO } from "../config/socket";
import { eventBus } from "../events/eventBus";
import { EVENTS } from "../constants/events";
import { PAYMENT_EVENTS } from "../payment/events/payment.events";
import { logger } from "../utils/logger";

/**
 * Register EventBus → Socket.IO bridges.
 * Controllers publish to Service → Service emits to EventBus → EventBus forwards to Socket.IO.
 */
export const registerSocketHandlers = (): void => {
  const io = getIO();

  // Merchant Events
  eventBus.onEvent("merchant:created" as any, (payload) => {
    io.emit("merchant:created", payload);
    logger.debug("Socket.IO → merchant:created broadcast");
  });

  eventBus.onEvent("merchant:updated" as any, (payload) => {
    io.emit("merchant:updated", payload);
    logger.debug("Socket.IO → merchant:updated broadcast");
  });

  eventBus.onEvent("merchant:deleted" as any, (payload) => {
    io.emit("merchant:deleted", payload);
    logger.debug("Socket.IO → merchant:deleted broadcast");
  });

  // Payment Events
  eventBus.onEvent(PAYMENT_EVENTS.PAYMENT_CREATED, (payload) => {
    io.emit(PAYMENT_EVENTS.PAYMENT_CREATED, payload);
    logger.debug("Socket.IO → payment:created broadcast");
  });

  eventBus.onEvent(PAYMENT_EVENTS.PAYMENT_APPROVED, (payload) => {
    io.emit(PAYMENT_EVENTS.PAYMENT_APPROVED, payload);
    logger.debug("Socket.IO → payment:approved broadcast");
  });

  eventBus.onEvent(PAYMENT_EVENTS.PAYMENT_DENIED, (payload) => {
    io.emit(PAYMENT_EVENTS.PAYMENT_DENIED, payload);
    logger.debug("Socket.IO → payment:denied broadcast");
  });

  eventBus.onEvent(PAYMENT_EVENTS.PAYMENT_COMPLETED, (payload) => {
    io.emit(PAYMENT_EVENTS.PAYMENT_COMPLETED, payload);
    logger.debug("Socket.IO → payment:completed broadcast");
  });

  eventBus.onEvent(PAYMENT_EVENTS.PAYMENT_FAILED, (payload) => {
    io.emit(PAYMENT_EVENTS.PAYMENT_FAILED, payload);
    logger.debug("Socket.IO → payment:failed broadcast");
  });

  // x402 Protocol Events (Milestone 4.2)
  eventBus.onEvent("x402:challenge" as any, (payload) => {
    io.emit("x402:challenge", payload);
    logger.debug("Socket.IO → x402:challenge broadcast");
  });

  eventBus.onEvent("x402:authorized" as any, (payload) => {
    io.emit("x402:authorized", payload);
    logger.debug("Socket.IO → x402:authorized broadcast");
  });

  eventBus.onEvent("x402:retry" as any, (payload) => {
    io.emit("x402:retry", payload);
    logger.debug("Socket.IO → x402:retry broadcast");
  });

  eventBus.onEvent("x402:negotiationCompleted" as any, (payload) => {
    io.emit("x402:negotiationCompleted", payload);
    logger.debug("Socket.IO → x402:negotiationCompleted broadcast");
  });

  eventBus.onEvent("x402:error" as any, (payload) => {
    io.emit("x402:error", payload);
    logger.debug("Socket.IO → x402:error broadcast");
  });

  // Algorand & Facilitator Telemetry Events (Milestone 4.3)
  eventBus.onEvent("wallet:connected" as any, (payload) => {
    io.emit("wallet:connected", payload);
  });

  eventBus.onEvent("wallet:balance" as any, (payload) => {
    io.emit("wallet:balance", payload);
  });

  eventBus.onEvent("wallet:error" as any, (payload) => {
    io.emit("wallet:error", payload);
  });

  eventBus.onEvent("payment:submitted" as any, (payload) => {
    io.emit("payment:submitted", payload);
  });

  eventBus.onEvent("receipt:verified" as any, (payload) => {
    io.emit("receipt:verified", payload);
  });

  eventBus.onEvent("facilitator:connected" as any, (payload) => {
    io.emit("facilitator:connected", payload);
  });

  eventBus.onEvent("facilitator:error" as any, (payload) => {
    io.emit("facilitator:error", payload);
  });

  // Policy Events
  eventBus.onEvent("policy:created" as any, (payload) => {
    io.emit("policy:created", payload);
    logger.debug("Socket.IO → policy:created broadcast");
  });

  eventBus.onEvent(EVENTS.POLICY_UPDATED, (payload) => {
    io.emit(EVENTS.POLICY_UPDATED, payload);
    logger.debug("Socket.IO → policy:updated broadcast");
  });

  eventBus.onEvent("policy:deleted" as any, (payload) => {
    io.emit("policy:deleted", payload);
    logger.debug("Socket.IO → policy:deleted broadcast");
  });

  eventBus.onEvent(EVENTS.KILL_SWITCH_TOGGLED, (payload) => {
    io.emit(EVENTS.KILL_SWITCH_TOGGLED, payload);
    logger.debug("Socket.IO → policy:killSwitch broadcast");
  });

  // Transaction & Audit Events
  eventBus.onEvent("transaction:added" as any, (payload) => {
    io.emit("transaction:added", payload);
    logger.debug("Socket.IO → transaction:added broadcast");
  });

  eventBus.onEvent(EVENTS.AUDIT_LOG_CREATED, (payload) => {
    io.emit(EVENTS.AUDIT_LOG_CREATED, payload);
    io.emit("audit:created", payload);
    logger.debug("Socket.IO → audit:created broadcast");
  });

  // Dashboard Events
  eventBus.onEvent(EVENTS.DASHBOARD_REFRESH, (payload) => {
    io.emit(EVENTS.DASHBOARD_REFRESH, payload);
    io.emit("dashboard:changed", payload);
    logger.debug("Socket.IO → dashboard:changed broadcast");
  });

  // Bazaar Events (Milestone 5.1)
  eventBus.onEvent("bazaar:providerCreated" as any, (payload) => {
    io.emit("bazaar:providerCreated", payload);
    logger.debug("Socket.IO → bazaar:providerCreated broadcast");
  });

  eventBus.onEvent("bazaar:providerUpdated" as any, (payload) => {
    io.emit("bazaar:providerUpdated", payload);
    logger.debug("Socket.IO → bazaar:providerUpdated broadcast");
  });

  eventBus.onEvent("bazaar:providerRemoved" as any, (payload) => {
    io.emit("bazaar:providerRemoved", payload);
    logger.debug("Socket.IO → bazaar:providerRemoved broadcast");
  });

  eventBus.onEvent("bazaar:capabilityCreated" as any, (payload) => {
    io.emit("bazaar:capabilityCreated", payload);
    logger.debug("Socket.IO → bazaar:capabilityCreated broadcast");
  });

  // Planner Events (Milestone 5.2)
  eventBus.onEvent("planner:analysisStarted" as any, (payload) => {
    io.emit("planner:analysisStarted", payload);
    logger.debug("Socket.IO → planner:analysisStarted broadcast");
  });

  eventBus.onEvent("planner:providersSelected" as any, (payload) => {
    io.emit("planner:providersSelected", payload);
    logger.debug("Socket.IO → planner:providersSelected broadcast");
  });

  eventBus.onEvent("planner:executionPlanCreated" as any, (payload) => {
    io.emit("planner:executionPlanCreated", payload);
    logger.debug("Socket.IO → planner:executionPlanCreated broadcast");
  });

  // Execution Engine Events (Milestone 5.3)
  eventBus.onEvent("execution:started" as any, (payload) => {
    io.emit("execution:started", payload);
    logger.debug("Socket.IO → execution:started broadcast");
  });

  eventBus.onEvent("execution:providerCompleted" as any, (payload) => {
    io.emit("execution:providerCompleted", payload);
    logger.debug("Socket.IO → execution:providerCompleted broadcast");
  });

  eventBus.onEvent("execution:consensusStarted" as any, (payload) => {
    io.emit("execution:consensusStarted", payload);
    logger.debug("Socket.IO → execution:consensusStarted broadcast");
  });

  eventBus.onEvent("execution:consensusCompleted" as any, (payload) => {
    io.emit("execution:consensusCompleted", payload);
    logger.debug("Socket.IO → execution:consensusCompleted broadcast");
  });

  eventBus.onEvent("execution:completed" as any, (payload) => {
    io.emit("execution:completed", payload);
    logger.debug("Socket.IO → execution:completed broadcast");
  });

  // Marketplace Events (Milestone 5.4)
  eventBus.onEvent("marketplace:providerCreated" as any, (payload) => {
    io.emit("marketplace:providerCreated", payload);
    logger.debug("Socket.IO → marketplace:providerCreated broadcast");
  });

  eventBus.onEvent("marketplace:providerUpdated" as any, (payload) => {
    io.emit("marketplace:providerUpdated", payload);
    logger.debug("Socket.IO → marketplace:providerUpdated broadcast");
  });

  eventBus.onEvent("marketplace:reviewCreated" as any, (payload) => {
    io.emit("marketplace:reviewCreated", payload);
    logger.debug("Socket.IO → marketplace:reviewCreated broadcast");
  });

  // Agent Platform Events (Milestone 5.5)
  eventBus.onEvent("agent:registered" as any, (payload) => {
    io.emit("agent:registered", payload);
    logger.debug("Socket.IO → agent:registered broadcast");
  });

  eventBus.onEvent("agent:started" as any, (payload) => {
    io.emit("agent:started", payload);
    logger.debug("Socket.IO → agent:started broadcast");
  });

  eventBus.onEvent("agent:completed" as any, (payload) => {
    io.emit("agent:completed", payload);
    logger.debug("Socket.IO → agent:completed broadcast");
  });

  eventBus.onEvent("approval:requested" as any, (payload) => {
    io.emit("approval:requested", payload);
    logger.debug("Socket.IO → approval:requested broadcast");
  });

  eventBus.onEvent("approval:approved" as any, (payload) => {
    io.emit("approval:approved", payload);
    logger.debug("Socket.IO → approval:approved broadcast");
  });

  eventBus.onEvent("governance:evaluated" as any, (payload) => {
    io.emit("governance:evaluated", payload);
    logger.debug("Socket.IO → governance:evaluated broadcast");
  });

  // Enterprise Intelligence Events (Milestone 5.6)
  eventBus.onEvent("intelligence:memoryUpdated" as any, (payload) => {
    io.emit("intelligence:memoryUpdated", payload);
    logger.debug("Socket.IO → intelligence:memoryUpdated broadcast");
  });

  eventBus.onEvent("intelligence:knowledgeUpdated" as any, (payload) => {
    io.emit("intelligence:knowledgeUpdated", payload);
    logger.debug("Socket.IO → intelligence:knowledgeUpdated broadcast");
  });

  eventBus.onEvent("intelligence:recommendationCreated" as any, (payload) => {
    io.emit("intelligence:recommendationCreated", payload);
    logger.debug("Socket.IO → intelligence:recommendationCreated broadcast");
  });

  eventBus.onEvent("intelligence:optimizationGenerated" as any, (payload) => {
    io.emit("intelligence:optimizationGenerated", payload);
    logger.debug("Socket.IO → intelligence:optimizationGenerated broadcast");
  });

  eventBus.onEvent("intelligence:learningCompleted" as any, (payload) => {
    io.emit("intelligence:learningCompleted", payload);
    logger.debug("Socket.IO → intelligence:learningCompleted broadcast");
  });

  // Enterprise Control Plane Events (Milestone 6.1)
  eventBus.onEvent("controlplane:organizationCreated" as any, (payload) => {
    io.emit("controlplane:organizationCreated", payload);
    logger.debug("Socket.IO → controlplane:organizationCreated broadcast");
  });

  eventBus.onEvent("controlplane:workspaceCreated" as any, (payload) => {
    io.emit("controlplane:workspaceCreated", payload);
    logger.debug("Socket.IO → controlplane:workspaceCreated broadcast");
  });

  eventBus.onEvent("controlplane:projectCreated" as any, (payload) => {
    io.emit("controlplane:projectCreated", payload);
    logger.debug("Socket.IO → controlplane:projectCreated broadcast");
  });

  eventBus.onEvent("controlplane:teamCreated" as any, (payload) => {
    io.emit("controlplane:teamCreated", payload);
    logger.debug("Socket.IO → controlplane:teamCreated broadcast");
  });

  eventBus.onEvent("controlplane:roleUpdated" as any, (payload) => {
    io.emit("controlplane:roleUpdated", payload);
    logger.debug("Socket.IO → controlplane:roleUpdated broadcast");
  });

  eventBus.onEvent("controlplane:apiKeyCreated" as any, (payload) => {
    io.emit("controlplane:apiKeyCreated", payload);
    logger.debug("Socket.IO → controlplane:apiKeyCreated broadcast");
  });

  eventBus.onEvent("controlplane:secretRotated" as any, (payload) => {
    io.emit("controlplane:secretRotated", payload);
    logger.debug("Socket.IO → controlplane:secretRotated broadcast");
  });

  eventBus.onEvent("controlplane:featureFlagUpdated" as any, (payload) => {
    io.emit("controlplane:featureFlagUpdated", payload);
    logger.debug("Socket.IO → controlplane:featureFlagUpdated broadcast");
  });

  // Distributed Infrastructure Events (Milestone 6.2)
  eventBus.onEvent("distributed:jobCreated" as any, (payload) => {
    io.emit("distributed:jobCreated", payload);
    logger.debug("Socket.IO → distributed:jobCreated broadcast");
  });

  eventBus.onEvent("distributed:jobStarted" as any, (payload) => {
    io.emit("distributed:jobStarted", payload);
    logger.debug("Socket.IO → distributed:jobStarted broadcast");
  });

  eventBus.onEvent("distributed:jobCompleted" as any, (payload) => {
    io.emit("distributed:jobCompleted", payload);
    logger.debug("Socket.IO → distributed:jobCompleted broadcast");
  });

  eventBus.onEvent("distributed:jobFailed" as any, (payload) => {
    io.emit("distributed:jobFailed", payload);
    logger.debug("Socket.IO → distributed:jobFailed broadcast");
  });

  eventBus.onEvent("distributed:workerRegistered" as any, (payload) => {
    io.emit("distributed:workerRegistered", payload);
    logger.debug("Socket.IO → distributed:workerRegistered broadcast");
  });

  eventBus.onEvent("distributed:deadLetterCreated" as any, (payload) => {
    io.emit("distributed:deadLetterCreated", payload);
    logger.debug("Socket.IO → distributed:deadLetterCreated broadcast");
  });

  // Enterprise API Gateway Events (Milestone 6.3)
  eventBus.onEvent("gateway:serviceRegistered" as any, (payload) => {
    io.emit("gateway:serviceRegistered", payload);
    logger.debug("Socket.IO → gateway:serviceRegistered broadcast");
  });

  eventBus.onEvent("gateway:requestCompleted" as any, (payload) => {
    io.emit("gateway:requestCompleted", payload);
    logger.debug("Socket.IO → gateway:requestCompleted broadcast");
  });

  eventBus.onEvent("gateway:routeReloaded" as any, (payload) => {
    io.emit("gateway:routeReloaded", payload);
    logger.debug("Socket.IO → gateway:routeReloaded broadcast");
  });

  // Enterprise Observability Events (Milestone 6.4)
  eventBus.onEvent("observability:traceStarted" as any, (payload) => {
    io.emit("observability:traceStarted", payload);
    logger.debug("Socket.IO → observability:traceStarted broadcast");
  });

  eventBus.onEvent("observability:traceCompleted" as any, (payload) => {
    io.emit("observability:traceCompleted", payload);
    logger.debug("Socket.IO → observability:traceCompleted broadcast");
  });

  eventBus.onEvent("observability:alertCreated" as any, (payload) => {
    io.emit("observability:alertCreated", payload);
    logger.debug("Socket.IO → observability:alertCreated broadcast");
  });

  eventBus.onEvent("observability:incidentOpened" as any, (payload) => {
    io.emit("observability:incidentOpened", payload);
    logger.debug("Socket.IO → observability:incidentOpened broadcast");
  });

  eventBus.onEvent("observability:incidentClosed" as any, (payload) => {
    io.emit("observability:incidentClosed", payload);
    logger.debug("Socket.IO → observability:incidentClosed broadcast");
  });

  // Enterprise Security Events (Milestone 6.5)
  eventBus.onEvent("security:incidentCreated" as any, (payload) => {
    io.emit("security:incidentCreated", payload);
    logger.debug("Socket.IO → security:incidentCreated broadcast");
  });

  eventBus.onEvent("security:threatDetected" as any, (payload) => {
    io.emit("security:threatDetected", payload);
    logger.debug("Socket.IO → security:threatDetected broadcast");
  });

  eventBus.onEvent("security:sessionRevoked" as any, (payload) => {
    io.emit("security:sessionRevoked", payload);
    logger.debug("Socket.IO → security:sessionRevoked broadcast");
  });

  eventBus.onEvent("security:policyUpdated" as any, (payload) => {
    io.emit("security:policyUpdated", payload);
    logger.debug("Socket.IO → security:policyUpdated broadcast");
  });

  eventBus.onEvent("security:complianceUpdated" as any, (payload) => {
    io.emit("security:complianceUpdated", payload);
    logger.debug("Socket.IO → security:complianceUpdated broadcast");
  });

  eventBus.onEvent("security:keyRotated" as any, (payload) => {
    io.emit("security:keyRotated", payload);
    logger.debug("Socket.IO → security:keyRotated broadcast");
  });

  // Enterprise DevOps Events (Milestone 6.6)
  eventBus.onEvent("devops:deploymentStarted" as any, (payload) => {
    io.emit("devops:deploymentStarted", payload);
    logger.debug("Socket.IO → devops:deploymentStarted broadcast");
  });

  eventBus.onEvent("devops:deploymentCompleted" as any, (payload) => {
    io.emit("devops:deploymentCompleted", payload);
    logger.debug("Socket.IO → devops:deploymentCompleted broadcast");
  });

  eventBus.onEvent("devops:rollbackStarted" as any, (payload) => {
    io.emit("devops:rollbackStarted", payload);
    logger.debug("Socket.IO → devops:rollbackStarted broadcast");
  });

  eventBus.onEvent("devops:backupCompleted" as any, (payload) => {
    io.emit("devops:backupCompleted", payload);
    logger.debug("Socket.IO → devops:backupCompleted broadcast");
  });

  eventBus.onEvent("devops:restoreCompleted" as any, (payload) => {
    io.emit("devops:restoreCompleted", payload);
    logger.debug("Socket.IO → devops:restoreCompleted broadcast");
  });

  // Enterprise Production Readiness Events (Milestone 6.7)
  eventBus.onEvent("production:failoverTested" as any, (payload) => {
    io.emit("production:failoverTested", payload);
    logger.debug("Socket.IO → production:failoverTested broadcast");
  });

  eventBus.onEvent("production:recoveryTested" as any, (payload) => {
    io.emit("production:recoveryTested", payload);
    logger.debug("Socket.IO → production:recoveryTested broadcast");
  });

  eventBus.onEvent("production:chaosRun" as any, (payload) => {
    io.emit("production:chaosRun", payload);
    logger.debug("Socket.IO → production:chaosRun broadcast");
  });

  eventBus.onEvent("production:releaseApproved" as any, (payload) => {
    io.emit("production:releaseApproved", payload);
    logger.debug("Socket.IO → production:releaseApproved broadcast");
  });

  // Agent Namespace Events
  const agentNs = io.of("/agent");

  eventBus.onEvent(EVENTS.RESEARCH_STARTED, (payload) => {
    agentNs.emit(EVENTS.RESEARCH_STARTED, payload);
  });

  eventBus.onEvent(EVENTS.STEP_STARTED, (payload) => {
    agentNs.emit(EVENTS.STEP_STARTED, payload);
  });

  eventBus.onEvent(EVENTS.RESEARCH_COMPLETED, (payload) => {
    agentNs.emit(EVENTS.RESEARCH_COMPLETED, payload);
  });

  eventBus.onEvent(EVENTS.RESEARCH_ERROR, (payload) => {
    agentNs.emit(EVENTS.RESEARCH_ERROR, payload);
  });

  logger.info("✅ Socket.IO ↔ EventBus bridges registered for all business events");
};
