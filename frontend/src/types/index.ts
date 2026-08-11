export interface User {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "admin" | "user" | "merchant";
  createdAt?: string;
}

export interface Merchant {
  _id: string;
  id?: string;
  name: string;
  alias: string;
  walletAddress: string;
  address?: string;
  network: "Base Sepolia Testnet" | "Algorand TestNet" | "Solana Devnet" | "Ethereum Sepolia" | string;
  status: "Pending" | "Verifying" | "Verified" | "Suspended" | "Blocked" | "Deleted" | string;
  verificationStatus?: string;
  overallScore?: number;
  trustScore?: number;
  verificationVersion?: number;
  verificationDetails?: MerchantVerificationResult;
  lastVerifiedAt?: string;
  verificationExpiresAt?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MerchantVerificationResult {
  merchantId: string;
  status: string;
  verified?: boolean;
  reason?: string;
  summary?: string;
  details?: string;
  overallScore?: number;
  trustScore?: number;
  strategies: {
    wallet: { passed: boolean; details: string; score?: number };
    network: { passed: boolean; details: string; score?: number };
    policy: { passed: boolean; details: string; score?: number };
    facilitator: { passed: boolean; details: string; score?: number };
    apiService: { passed: boolean; details: string; score?: number };
  };
  verifiedAt: string;
}

export interface SpendPolicy {
  _id: string;
  id?: string;
  merchant: string | Merchant;
  merchantId?: string;
  merchantAlias?: string;
  version?: number;
  dailyBudget: number;
  spentToday: number;
  transactionLimit: number;
  maxTransactionsPerMinute: number;
  maxTxPerMinute?: number;
  killSwitch: boolean;
  enabled: boolean;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  _id: string;
  id?: string;
  merchant: string | Merchant;
  amount: number;
  currency: string;
  network: string;
  status: "PENDING" | "PROCESSING" | "APPROVED" | "SETTLED" | "FAILED" | "DENIED" | string;
  correlationId: string;
  policyDecision?: {
    passed: boolean;
    reason?: string;
    evaluatedAt?: string;
  };
  policySnapshot?: any;
  txHash?: string;
  createdAt: string;
}

export interface ApiService {
  _id: string;
  id?: string;
  name: string;
  serviceId: string;
  merchantId: string;
  merchantAlias?: string;
  endpoint: string;
  pricePerCall: number;
  currency: string;
  capabilities: string[];
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  _id: string;
  id?: string;
  action: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  merchantId?: string;
  merchantAlias?: string;
  details?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ResearchPlanStep {
  id: number;
  type: string;
  title: string;
  input: Record<string, any>;
  status?: string;
  output?: any;
  cost?: number;
}

export interface AgentRun {
  _id: string;
  id?: string;
  query: string;
  status: "planning" | "executing" | "completed" | "failed";
  userId?: string;
  steps: ResearchPlanStep[];
  plan?: ResearchPlanStep[];
  results?: any;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineEvent {
  _id: string;
  runId: string;
  stepId?: number;
  event: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HealthStatus {
  status: string;
  version: string;
  environment: string;
  serverTime: string;
  uptimeSeconds: number;
  merchantVerification: {
    verified: number;
    pending: number;
    suspended: number;
    blocked: number;
    expired: number;
  };
  subsystems: {
    database: { status: string; host: string };
    ai: { provider: string; model: string; status: string };
    paymentSystem: { mode: string; defaultAsset: string; defaultNetwork: string };
    algorandWallet: { initialized: boolean; address: string; network: string; algoBalance: number; usdcBalance: number };
    facilitator: { endpoint: string; status: string };
    messaging: { eventBus: string; socketIO: string };
  };
}

export interface DashboardSummary {
  // Flat backend fields from analyticsService.getOverviewData()
  merchantCount?: number;
  todaysSpend?: number;
  totalSpend?: number;
  approvedTransactions?: number;
  deniedTransactions?: number;
  activePolicies?: number;
  averageTransactionAmount?: number;
  highestSpendingMerchant?: string;
  mostUsedNetwork?: string;
  latestActivity?: {
    action: string;
    timestamp: string;
  } | null;

  // Nested structures (defensive optional)
  merchants?: {
    total?: number;
    verified?: number;
    pending?: number;
    suspended?: number;
    blocked?: number;
  };
  transactions?: {
    todayCount?: number;
    todayAmount?: number;
    totalCount?: number;
    totalAmount?: number;
    successRate?: number;
  };
  budget?: {
    allocated?: number;
    spentToday?: number;
    remaining?: number;
    usagePercentage?: number;
  };
  research?: {
    totalRuns?: number;
    activeRuns?: number;
    completedRuns?: number;
  };
  recentActivity?: Array<{
    type?: string;
    description?: string;
    timestamp: string;
    status?: string;
    metadata?: any;
  }>;
}

export interface DashboardCharts {
  // Flat backend fields from analyticsService.getChartData()
  dailySpend?: Array<{ date: string; spend: number; count: number }>;
  transactionTrend?: Array<{ date: string; status: string; count: number }>;
  merchantDistribution?: Array<{ merchant: string; spend: number; count: number }>;
  approvalRatio?: number;

  // Visual chart structures
  transactionVolume?: Array<{ timestamp: string; amount: number; count: number }>;
  merchantStatusDistribution?: Array<{ status: string; count: number }>;
  networkDistribution?: Array<{ network: string; count: number }>;
  budgetUsageHistory?: Array<{ timestamp: string; spent: number; limit: number }>;
}

export interface ProviderListing {
  _id: string;
  id?: string;
  providerId: string;
  merchantId: string | Merchant;
  serviceId?: string | ApiService;
  capabilities: string[];
  supportedNetworks: string[];
  pricePerCall: number;
  currency: string;
  availability: boolean;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "DEPRECATED" | string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Capability {
  _id: string;
  id?: string;
  name: string;
  displayName: string;
  description: string;
  category: "FINANCE" | "DATA" | "AI" | "UTILITY" | "SECURITY" | "ANALYTICS" | string;
  tags: string[];
  version: string;
  status: "ACTIVE" | "DEPRECATED" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BazaarRankedCandidate {
  listing: ProviderListing;
  merchant: {
    id: string;
    alias: string;
    walletAddress: string;
    status: string;
    isVerified: boolean;
    trustScore: number;
  };
  metrics: {
    verificationScore: number;
    trustScore: number;
    latencyMs: number;
    successRate: number;
    compositeScore: number;
  };
}

export interface BazaarOverviewMetrics {
  totalProviders: number;
  healthyProviders: number;
  offlineProviders: number;
  activeCapabilities: number;
  averageTrustScore: number;
  averageLatencyMs: number;
  latestActivity?: {
    action: string;
    timestamp: string;
  } | null;
}

export interface SelectionExplanation {
  selectedProviderId: string;
  merchantAlias: string;
  capability: string;
  plannerScore: number;
  selectionReason: string;
  rankingBreakdown: {
    capabilityMatchScore: number;
    verificationScore: number;
    trustScore: number;
    latencyScore: number;
    priceScore: number;
    compositeScore: number;
  };
  rejectedProvidersCount: number;
  estimatedCost: number;
  estimatedLatencyMs: number;
}

export interface ExecutionProviderStep {
  stepId: number;
  title: string;
  capability: string;
  provider: {
    id: string;
    providerId: string;
    merchantId: string;
    merchantAlias: string;
    walletAddress: string;
    isVerified: boolean;
    trustScore: number;
    pricePerCall: number;
    supportedNetworks: string[];
  };
  explanation: SelectionExplanation;
  inputParams?: Record<string, any>;
  status: "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED" | "UNRESOLVED" | string;
}

export interface PlannerCapabilitySpec {
  name: string;
  displayName: string;
  category: string;
  required: boolean;
  estimatedComplexity: "LOW" | "MEDIUM" | "HIGH" | string;
  suggestedAlternatives?: string[];
}

export interface PlannerExecutionPlan {
  planId: string;
  prompt: string;
  status: "RESOLVED" | "UNRESOLVED_CAPABILITIES" | "FAILED" | string;
  capabilities: PlannerCapabilitySpec[];
  steps: ExecutionProviderStep[];
  unresolvedCapabilities?: Array<{
    capability: string;
    reason: string;
    suggestedAlternatives?: string[];
  }>;
  summary: {
    totalSteps: number;
    resolvedSteps: number;
    unresolvedSteps: number;
    estimatedCostUsd: number;
    estimatedLatencyMs: number;
    averageConfidenceScore: number;
    planningDurationMs: number;
  };
  createdAt: string;
}

export interface ExecutionAttempt {
  attemptId: string;
  providerId: string;
  merchantAlias: string;
  status: "SUCCESS" | "FAILED" | "TIMEOUT" | "CIRCUIT_OPEN" | "PAYMENT_REJECTED" | string;
  durationMs: number;
  output?: any;
  error?: string;
  costUsd: number;
  txHash?: string;
  timestamp: string;
}

export interface ConsensusResult {
  strategy: string;
  agreementScore: number;
  confidence: number;
  finalResult: any;
  participatingProvidersCount: number;
  agreedProvidersCount: number;
  rejectedResponses?: any[];
}

export interface ExecutionSessionRecord {
  _id?: string;
  sessionId: string;
  runId?: string;
  planId?: string;
  capability: string;
  strategy: "SEQUENTIAL" | "PARALLEL" | "BALANCED" | "CONSENSUS" | string;
  state: "CREATED" | "DISCOVERING" | "RANKING" | "EXECUTING" | "WAITING_FALLBACK" | "CONSENSUS" | "PAYMENT" | "COMPLETED" | "FAILED" | string;
  success: boolean;
  finalProviderId?: string;
  finalMerchantAlias?: string;
  output?: any;
  attempts: ExecutionAttempt[];
  fallbackTriggered: boolean;
  fallbackCount: number;
  consensus?: ConsensusResult;
  totalCostUsd: number;
  totalDurationMs: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface ExecutionTelemetry {
  activeExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  averageExecutionTimeMs: number;
  averageRetries: number;
  fallbackRate: number;
  parallelExecutions: number;
  providerSuccessRate: number;
  providerFailureRate: number;
  averageLatencyMs: number;
  consensusRate: number;
}

export interface PricingPolicyRecord {
  id?: string;
  providerId: string;
  tierName: string;
  pricePerCall: number;
  monthlyQuota: number;
  currency: string;
  freeTierCalls?: number;
  enterpriseCustomPrice?: boolean;
}

export interface SLAProfileRecord {
  id?: string;
  providerId: string;
  uptimePercentage: number;
  maxLatencyMs: number;
  guaranteedAvailability: string;
  monthlyQuota?: number;
  supportLevel?: string;
}

export interface ReviewRecord {
  id?: string;
  reviewId: string;
  providerId: string;
  authorId: string;
  authorAlias: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ProviderProfileRecord {
  id?: string;
  providerId: string;
  merchantAlias: string;
  displayName: string;
  description: string;
  category: string;
  capabilities: string[];
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  documentationUrl?: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "DEPRECATED" | "ARCHIVED" | string;
  visibility: "PUBLIC" | "PRIVATE" | string;
  supportedRegions: string[];
  businessVerified: boolean;
  reputationScore: number;
  certifications: string[];
  pricingModel?: PricingPolicyRecord;
  slaProfile?: SLAProfileRecord;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketplaceAnalyticsRecord {
  totalProviders: number;
  verifiedProviders: number;
  certifiedProviders: number;
  activeProviders: number;
  pendingApprovals: number;
  averageRating: number;
  averageLatencyMs: number;
  marketplaceRevenueUsd: number;
  activeSubscriptions: number;
  reviewCount: number;
  topCapabilities: { capability: string; providerCount: number }[];
  providerAvailabilityRate: number;
}

export interface AgentProfileRecord {
  id?: string;
  agentId: string;
  agentName: string;
  role: string;
  capabilities: string[];
  confidenceScore: number;
  costPerCallUsd: number;
  averageLatencyMs: number;
  status: "IDLE" | "BUSY" | "ROUTING" | "REASONING" | "WAITING_APPROVAL" | "OFFLINE" | "MAINTENANCE" | string;
  systemPrompt?: string;
  permissions: string[];
  createdAt?: string;
}

export interface AgentSubtaskRecord {
  subtaskId: string;
  capability: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  input: any;
  output?: any;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "WAITING_APPROVAL" | string;
  dependencies: string[];
  confidence?: number;
  durationMs?: number;
  error?: string;
}

export interface AgentExecutionPlanRecord {
  id?: string;
  sessionId: string;
  prompt: string;
  taskGraph: AgentSubtaskRecord[];
  status: "CREATED" | "ORCHESTRATING" | "WAITING_APPROVAL" | "COMPLETED" | "FAILED" | string;
  consensusResult?: any;
  totalCostUsd: number;
  totalDurationMs: number;
  createdAt?: string;
  completedAt?: string;
}

export interface AgentMemoryRecord {
  id?: string;
  memoryId: string;
  sessionId: string;
  key: string;
  value: any;
  sourceAgentId: string;
  tags: string[];
  createdAt?: string;
}

export interface ApprovalRequestRecord {
  id?: string;
  approvalId: string;
  sessionId: string;
  capability: string;
  riskScore: number;
  reason: string;
  requestedByAgentId: string;
  status: "WAITING_APPROVAL" | "APPROVED" | "REJECTED" | "EXPIRED" | string;
  decisionBy?: string;
  createdAt?: string;
}

export interface GovernanceEvaluationRecord {
  allowed: boolean;
  requiresApproval: boolean;
  riskScore: number;
  policyViolations: string[];
  maxAllowedSpendUsd: number;
}

export interface KnowledgeNodeRecord {
  id?: string;
  nodeId: string;
  nodeType: "PROVIDER" | "CAPABILITY" | "AGENT" | "USER" | "POLICY" | "EXECUTION" | "ORGANIZATION" | string;
  label: string;
  properties: Record<string, any>;
  createdAt?: string;
}

export interface KnowledgeEdgeRecord {
  id?: string;
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: "OFFERS_CAPABILITY" | "USES_PROVIDER" | "ENFORCES_POLICY" | "DEPENDS_ON" | "ROUTED_TO" | string;
  weight: number;
  version: number;
  createdAt?: string;
}

export interface SemanticMemoryRecord {
  id?: string;
  memoryId: string;
  memoryType: "SEMANTIC" | "EPISODIC" | "PROCEDURAL" | "ORGANIZATIONAL" | string;
  title: string;
  content: string;
  confidenceScore: number;
  memoryVersion: number;
  sourceDomain: string;
  visibility: string;
  expirationDate?: string;
  tags: string[];
  createdAt?: string;
}

export interface OptimizationRecommendationRecord {
  id?: string;
  recommendationId: string;
  category: "OPERATIONAL" | "COST" | "QUALITY" | "SECURITY" | "GOVERNANCE" | "MARKETPLACE" | string;
  title: string;
  description: string;
  targetEntityId: string;
  targetEntityType: string;
  impactScore: number;
  estimatedSavingsUsd?: number;
  status: "RECOMMENDING" | "WAITING_APPROVAL" | "APPLIED" | "ARCHIVED" | string;
  proposedConfig: Record<string, any>;
  createdAt?: string;
}

export interface IntelligenceAnalyticsRecord {
  knowledgeNodeCount: number;
  knowledgeEdgeCount: number;
  totalSemanticMemories: number;
  optimizationRecommendationsCount: number;
  learningAccuracy: number;
  semanticSearchLatencyMs: number;
  memoryGrowthRate: number;
  topCategories: { category: string; count: number }[];
}

export interface OrganizationRecord {
  id?: string;
  organizationId: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "ARCHIVED" | string;
  ownerId: string;
  maxWorkspaces: number;
  createdAt?: string;
}

export interface WorkspaceRecord {
  id?: string;
  workspaceId: string;
  organizationId: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;
  maxProjects: number;
  createdAt?: string;
}

export interface ProjectRecord {
  id?: string;
  projectId: string;
  workspaceId: string;
  organizationId: string;
  name: string;
  status: "ACTIVE" | "DEVELOPMENT" | "STAGING" | "PRODUCTION" | "ARCHIVED" | string;
  createdAt?: string;
}

export interface TeamRecord {
  id?: string;
  teamId: string;
  organizationId: string;
  workspaceId?: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt?: string;
}

export interface RoleRecord {
  id?: string;
  roleId: string;
  roleName: string;
  scope: "ORGANIZATION" | "WORKSPACE" | "PROJECT" | "SYSTEM" | "CUSTOM" | string;
  permissions: string[];
  isCustom: boolean;
  createdAt?: string;
}

export interface APIKeyRecord {
  id?: string;
  keyId: string;
  organizationId: string;
  keyName: string;
  maskedKey: string;
  rawKey?: string;
  scopes: string[];
  expiresAt?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED" | string;
  createdAt?: string;
}

export interface SecretRecord {
  id?: string;
  secretId: string;
  organizationId: string;
  keyName: string;
  version: number;
  status: "ACTIVE" | "PREVIOUS" | "PENDING_ROTATION" | string;
  createdAt?: string;
}

export interface FeatureFlagRecord {
  id?: string;
  flagId: string;
  name: string;
  key: string;
  enabled: boolean;
  targetScope: "GLOBAL" | "ORGANIZATION" | "WORKSPACE" | "PROJECT" | "ENVIRONMENT" | string;
  targetId?: string;
  createdAt?: string;
}

export interface QuotaPolicyRecord {
  id?: string;
  quotaId: string;
  organizationId: string;
  maxDailySpendUsd: number;
  maxDailyRequests: number;
  currentDailySpendUsd: number;
  currentDailyRequests: number;
  updatedAt?: string;
}

export interface ControlPlaneAnalyticsRecord {
  organizations: number;
  workspaces: number;
  projects: number;
  teams: number;
  members: number;
  apiKeys: number;
  activeApiKeys: number;
  secrets: number;
  featureFlags: number;
  quotaUsage: number;
  activeInvitations: number;
}

export interface JobRecord {
  id?: string;
  jobId: string;
  queueName: string;
  category: string;
  payload: Record<string, any>;
  priority: number;
  status: "QUEUED" | "DISPATCHED" | "RUNNING" | "RETRYING" | "COMPLETED" | "FAILED" | "DEAD_LETTER" | "CANCELLED" | string;
  correlationId?: string;
  idempotencyKey?: string;
  assignedWorkerId?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface QueueRecord {
  id?: string;
  queueName: string;
  category: string;
  pendingJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  maxDepth: number;
  createdAt?: string;
}

export interface WorkerRecord {
  id?: string;
  workerId: string;
  workerType: string;
  assignedQueues: string[];
  status: "IDLE" | "BUSY" | "PAUSED" | "OFFLINE" | "MAINTENANCE" | string;
  activeJobsCount: number;
  processedJobsCount: number;
  lastHeartbeat?: string;
  uptimeSeconds: number;
  createdAt?: string;
}

export interface ScheduledTaskRecord {
  id?: string;
  taskId: string;
  taskName: string;
  cronExpression: string;
  targetQueue: string;
  jobCategory: string;
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt?: string;
}

export interface EventStoreRecord {
  id?: string;
  eventId: string;
  domain: string;
  eventName: string;
  payload: Record<string, any>;
  createdAt?: string;
}

export interface DistributedAnalyticsRecord {
  activeWorkers: number;
  activeQueues: number;
  queuedJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  retryCount: number;
  deadLetterJobs: number;
  schedulerJobs: number;
  averageQueueLatency: number;
  averageExecutionLatency: number;
}

export interface ServiceRegistryRecord {
  id?: string;
  serviceId: string;
  serviceName: string;
  targetUrl: string;
  version: string;
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY" | "OFFLINE" | string;
  latencyMs: number;
  lastHealthCheck?: string;
  weight: number;
  createdAt?: string;
}

export interface RouteDefinitionRecord {
  id?: string;
  routeId: string;
  pathPattern: string;
  targetServiceId: string;
  apiVersion: string;
  methods: string[];
  enabled: boolean;
  rateLimitPerMin: number;
  authRequired: boolean;
  createdAt?: string;
}

export interface GatewayPolicyRecord {
  id?: string;
  policyId: string;
  scope: "GLOBAL" | "TENANT" | "ORGANIZATION" | "WORKSPACE" | "ENDPOINT" | string;
  targetId?: string;
  rateLimitPerMin: number;
  burstLimit: number;
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
  createdAt?: string;
}

export interface GatewayAnalyticsRecord {
  registeredServices: number;
  healthyServices: number;
  requestsPerMinute: number;
  averageLatencyMs: number;
  failedRequests: number;
  rateLimitedRequests: number;
  activeConnections: number;
  gatewayUptime: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
}

export interface TraceRecord {
  id?: string;
  traceId: string;
  rootSpanName: string;
  serviceName: string;
  status: string;
  durationMs: number;
  spansCount: number;
  createdAt?: string;
}

export interface MetricRecord {
  id?: string;
  metricName: string;
  metricType: string;
  value: number;
  serviceName: string;
  tags: Record<string, string>;
  createdAt?: string;
}

export interface LogEntryRecord {
  id?: string;
  logId: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "AUDIT" | "SECURITY" | string;
  message: string;
  serviceName: string;
  traceId?: string;
  correlationId?: string;
  createdAt?: string;
}

export interface AlertRuleRecord {
  id?: string;
  ruleId: string;
  ruleName: string;
  targetMetric: string;
  threshold: number;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  enabled: boolean;
  createdAt?: string;
}

export interface AlertRecord {
  id?: string;
  alertId: string;
  ruleId?: string;
  title: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  status: "ACTIVE" | "RESOLVED" | "ACKNOWLEDGED" | string;
  serviceName: string;
  message: string;
  createdAt?: string;
}

export interface IncidentRecord {
  id?: string;
  incidentId: string;
  title: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  status: "OPEN" | "ACKNOWLEDGED" | "INVESTIGATING" | "MITIGATED" | "RESOLVED" | "CLOSED" | string;
  affectedServices: string[];
  rootCause?: string;
  openedAt?: string;
  resolvedAt?: string;
  createdAt?: string;
}

export interface SloRecord {
  serviceName: string;
  sloTargetPercent: number;
  currentAvailabilityPercent: number;
  errorBudgetRemainingPercent: number;
  mttrMinutes: number;
}

export interface ObservabilityAnalyticsRecord {
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

export interface SessionRecord {
  id?: string;
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  status: "ACTIVE" | "EXPIRED" | "REVOKED" | string;
  isMfaVerified: boolean;
  expiresAt: string;
  createdAt?: string;
}

export interface MfaDeviceRecord {
  id?: string;
  deviceId: string;
  userId: string;
  deviceType: string;
  deviceName: string;
  isTrusted: boolean;
  createdAt?: string;
}

export interface AuthorizationPolicyRecord {
  id?: string;
  policyId: string;
  policyName: string;
  subjectRole: string;
  resource: string;
  action: string;
  effect: "PERMIT" | "DENY" | string;
  conditions?: Record<string, any>;
  createdAt?: string;
}

export interface ComplianceReportRecord {
  id?: string;
  framework: string;
  overallStatus: "COMPLIANT" | "NON_COMPLIANT" | "PARTIAL" | string;
  passedControlsCount: number;
  totalControlsCount: number;
  scorePercent: number;
  lastAuditedAt: string;
}

export interface ThreatEventRecord {
  id?: string;
  threatId: string;
  threatType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  ipAddress: string;
  description: string;
  status: "ACTIVE" | "MITIGATED" | "IGNORED" | string;
  createdAt?: string;
}

export interface SecurityIncidentRecord {
  id?: string;
  incidentId: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  status: "OPEN" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "CLOSED" | string;
  affectedResources: string[];
  summary: string;
  createdAt?: string;
}

export interface SecurityAnalyticsRecord {
  activeSessions: number;
  mfaEnabledUsers: number;
  trustedDevices: number;
  activeSecurityPolicies: number;
  complianceScorePercent: number;
  activeThreats: number;
  openSecurityIncidents: number;
  encryptionKeyVersion: string;
  failedAuthAttempts: number;
  riskScoreAverage: number;
}

export interface ClusterRecord {
  id?: string;
  clusterId: string;
  name: string;
  region: string;
  provider: string;
  kubernetesVersion: string;
  nodeCount: number;
  status: "HEALTHY" | "DEGRADED" | "PROVISIONING" | "OFFLINE" | string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  createdAt?: string;
}

export interface DeploymentRecord {
  id?: string;
  deploymentId: string;
  name: string;
  namespace: string;
  clusterId: string;
  imageTag: string;
  replicas: number;
  availableReplicas: number;
  strategy: string;
  status: "RUNNING" | "CANARY_PROMOTING" | "ROLLING_BACK" | "FAILED" | "STOPPED" | string;
  createdAt?: string;
}

export interface PipelineRecord {
  id?: string;
  pipelineId: string;
  name: string;
  repositoryUrl: string;
  branch: string;
  lastRunStatus: "QUEUED" | "BUILDING" | "TESTING" | "SIGNING" | "SUCCESS" | "FAILED" | string;
  totalBuildsCount: number;
  createdAt?: string;
}

export interface SbomRecord {
  id?: string;
  sbomId: string;
  imageRef: string;
  componentsCount: number;
  vulnerabilitiesFoundCount: number;
  format: string;
  createdAt?: string;
}

export interface ArtifactSignatureRecord {
  id?: string;
  signatureId: string;
  imageRef: string;
  signerIdentity: string;
  algorithm: string;
  isVerified: boolean;
  signedAt?: string;
}

export interface GitOpsApplicationRecord {
  id?: string;
  appId: string;
  appName: string;
  repoUrl: string;
  path: string;
  targetRevision: string;
  syncStatus: string;
  healthStatus: string;
  createdAt?: string;
}

export interface AutoscalingPolicyRecord {
  id?: string;
  policyId: string;
  deploymentName: string;
  minReplicas: number;
  maxReplicas: number;
  targetCpuPercent: number;
  targetMemoryPercent: number;
  currentReplicas: number;
  enabled: boolean;
  createdAt?: string;
}

export interface BackupPolicyRecord {
  id?: string;
  backupId: string;
  name: string;
  targetCluster: string;
  snapshotSizeGb: number;
  status: string;
  createdAt?: string;
}

export interface DevOpsAnalyticsRecord {
  clustersCount: number;
  healthyClustersCount: number;
  deploymentsCount: number;
  activePodsCount: number;
  runningPipelinesCount: number;
  gitOpsAppsCount: number;
  hpaPoliciesCount: number;
  signedImagesCount: number;
  sbomsGeneratedCount: number;
  completedBackupsCount: number;
}

export interface RegionRecord {
  id?: string;
  regionId: string;
  name: string;
  code: string;
  isPrimary: boolean;
  status: "ACTIVE" | "STANDBY" | "FAILOVER_IN_PROGRESS" | "DEGRADED" | string;
  latencyMs: number;
  createdAt?: string;
}

export interface PerformanceReportRecord {
  id?: string;
  reportId: string;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  requestsPerSecond: number;
  cacheHitRatioPercent: number;
  bottlenecksFound: string[];
  createdAt?: string;
}

export interface DisasterRecoveryValidationRecord {
  id?: string;
  validationId: string;
  rpoActualSeconds: number;
  rtoActualSeconds: number;
  backupIntegrityVerified: boolean;
  status: "PASSED" | "FAILED" | string;
  testedAt?: string;
}

export interface ChaosExperimentRecord {
  id?: string;
  experimentId: string;
  title: string;
  faultType: string;
  targetService: string;
  resilienceScorePercent: number;
  status: "SCHEDULED" | "RUNNING" | "PASSED" | "FAILED" | string;
  lastExecutedAt?: string;
}

export interface ReleaseRecord {
  id?: string;
  releaseId: string;
  version: string;
  title: string;
  status: "APPROVED" | "PENDING" | "FROZEN" | "REJECTED" | string;
  approvedBy?: string;
  scheduledAt?: string;
  createdAt?: string;
}

export interface OperationalRunbookRecord {
  id?: string;
  runbookId: string;
  title: string;
  service: string;
  ownerTeam: string;
  stepsCount: number;
  lastUpdated?: string;
}

export interface ProductionCertificationRecord {
  readinessScorePercent: number;
  grade: string;
  isHaVerified: boolean;
  isDrVerified: boolean;
  isChaosVerified: boolean;
  certifiedAt: string;
}

export interface ProductionAnalyticsRecord {
  readinessScorePercent: number;
  grade: string;
  activeRegionsCount: number;
  haStatus: string;
  drStatus: string;
  chaosResilienceScorePercent: number;
  pendingReleasesCount: number;
  operationalRunbooksCount: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}
