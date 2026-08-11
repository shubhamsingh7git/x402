# x402 Agentic Commerce Backend Architecture Specification v1.0
**Document Version:** 1.0.0  
**Author:** Principal Software Architect  
**Target Audience:** Engineering Leads, Senior Backend Engineers, Security Architects, Systems Engineers  
**Status:** Approved Architectural Blueprint  

---

## Table of Contents
1. [Vision & System Requirements](#1-vision--system-requirements)
2. [Complete System Architecture](#2-complete-system-architecture)
3. [Layered Architecture & Boundary Rules](#3-layered-architecture--boundary-rules)
4. [Component Specifications](#4-component-specifications)
5. [Payment Architecture](#5-payment-architecture)
6. [Payment State Machine](#6-payment-state-machine)
7. [Execution State Machine](#7-execution-state-machine)
8. [Sequence Diagrams](#8-sequence-diagrams)
9. [Executor Framework & Extension Points](#9-executor-framework--extension-points)
10. [Service Discovery & Bazaar Architecture](#10-service-discovery--bazaar-architecture)
11. [Multi-Chain Wallet Architecture](#11-multi-chain-wallet-architecture)
12. [Policy Guard Evaluation Pipeline](#12-policy-guard-evaluation-pipeline)
13. [Database Architecture & Data Design](#13-database-architecture--data-design)
14. [Event Architecture & Decoupled EventBus](#14-event-architecture--decoupled-eventbus)
15. [Socket.IO & Real-Time Streaming Architecture](#15-socketio--real-time-streaming-architecture)
16. [Error Architecture & Exception Hierarchy](#16-error-architecture--exception-hierarchy)
17. [Security & Threat Model](#17-security--threat-model)
18. [Scalability & High Availability Architecture](#18-scalability--high-availability-architecture)
19. [Deployment & Infrastructure Topology](#19-deployment--infrastructure-topology)
20. [Future Architectural Roadmap](#20-future-architectural-roadmap)

---

## 1. Vision & System Requirements

### 1.1 Problem Statement
Autonomous AI agents are rapidly evolving from chat interfaces into action-oriented autonomous workflows that require paid external micro-services, proprietary data feeds, compute endpoints, and third-party APIs. Traditional Web2 API payment architectures rely on human-oriented subscriptions, credit cards, or API keys, creating massive friction for autonomous machine-to-machine commerce. 

Furthermore, unrestricted AI agent access to treasury funds poses catastrophic financial risks: runaway loops, unverified API vendors, or prompt injection attacks can drain corporate wallets in seconds. Current systems lack a unified, cryptographic, real-time middleware layer that governs micro-transactions via hard spend policies while enabling standard HTTP-native payment handshakes (x402 Protocol).

### 1.2 Architectural Vision
The **x402 Agentic Commerce Platform** establishes an enterprise-grade backend infrastructure enabling AI agents to autonomously discover monetized APIs, negotiate HTTP 402 Payment Challenges, enforce cryptographic spending rules via Policy Guard, and settle transactions across distributed ledgers (Algorand, Base, Solana, Ethereum) in real-time.

```
+-----------------------------------------------------------------------------------+
|                            x402 AGENTIC COMMERCE ENGINE                           |
|                                                                                   |
|  +--------------------+     +---------------------+     +----------------------+  |
|  |   AI ORCHESTRATION |     |   POLICY GUARD      |     |   x402 HANDSHAKE     |  |
|  |   - Multi-Step Plan| --> |   - Daily Budget Cap| --> |   - HTTP 402 Challenge |  |
|  |   - Step Execution |     |   - Velocity Limits |     |   - Micro-Settlement |  |
|  +--------------------+     +---------------------+     +----------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                DECOUPLED EVENT BUS & REAL-TIME SOCKET STREAMING             |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 1.3 System Goals
* **Deterministic Governance**: Intercept every machine-to-machine financial commitment before signature generation.
* **Protocol-Native Payment Handling**: Seamlessly decode HTTP 402 challenges, sign payloads, and verify settlements.
* **Extensible Executor Plug-ins**: Abstract external API integrations into standardized, plug-and-play step executors.
* **Multi-Chain Wallet Abstraction**: Provide uniform signing interfaces for Algorand (ASA/ALGO), EVM chains (Base, Polygon), and Solana.
* **Audit & Transparency**: Persist non-repudiable audit logs and policy decision snapshots linking AI reasoning to on-chain transaction hashes.

### 1.4 Non-Goals
* **Prompt Engineering IDE**: The system is not a visual prompt builder tool.
* **End-User Wallet Custodial App**: The platform manages session wallets for AI agents; it is not a retail crypto wallet interface.
* **Speculative Trading Engine**: The platform governs functional micro-service payments, not automated market making or trading bots.

### 1.5 Functional Requirements
1. **Research Request Processing**: Ingest research queries, generate multi-step execution plans, and execute steps sequentially.
2. **Policy Enforcement**: Evaluate transaction limits, daily budget ceilings, velocity limits, kill-switches, and merchant allowlists prior to signing payments.
3. **HTTP 402 Payment Lifecycle**: Process 402 challenges, generate authorization headers, verify settlement on-chain, and record transaction receipts.
4. **Live Execution Telemetry**: Stream step status, timeline events, and payment state transitions to connected web clients via WebSockets.
5. **Auditing & Reporting**: Maintain immutable logs of user actions, policy decisions, and execution timelines.

### 1.6 Non-Functional Requirements
* **Latency**: Policy evaluation overhead MUST be $< 15\text{ms}$. End-to-end payment handshake overhead $< 250\text{ms}$ (excluding ledger finality).
* **Availability**: $99.95\%$ uptime for API gateways and WebSocket servers.
* **Scalability**: Support $10,000+$ concurrent agent runs and $1,000+$ transactions per second via horizontal scaling.
* **Security**: Zero plain-text storage of private keys or credentials. Mandatory JWT authentication on all non-public routes. Strict rate-limiting ($100\text{ req/min/IP}$).

### 1.7 Assumptions & Constraints
* **Node Environment**: Node.js v22+, TypeScript v5.8+, Express.js v4+.
* **Database**: MongoDB Atlas / v8.0+ with replica sets for transaction consistency.
* **State Preservation**: The existing Milestone 1–3 codebase layout, routes, and model structures MUST be preserved and extended, not refactored.

---

## 2. Complete System Architecture

The system follows an event-driven, micro-layered architecture where business modules communicate asynchronously via an in-memory `EventBus` and Socket.IO bridges.

```
+---------------------------------------------------------------------------------------------------------------+
|                                            CLIENT LAYER (NEXT.JS UI)                                          |
+---------------------------------------------------------------------------------------------------------------+
                                  | HTTP (REST)                           | WebSockets (Socket.IO /agent)
                                  v                                       v
+---------------------------------------------------------------------------------------------------------------+
|                                                API GATEWAY LAYER                                              |
|  - Helmet Security    - Cors Policy    - Rate Limiter (100 req/min)    - Request ID Tracing    - JWT Auth    |
+---------------------------------------------------------------------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------------------------------------------+
|                                             APPLICATION SERVICES                                              |
|   +------------------+   +-------------------+   +--------------------+   +--------------------------------+  |
|   | Research Service |   | Merchant Service  |   |   Policy Service   |   |       Dashboard Service        |  |
|   +------------------+   +-------------------+   +--------------------+   +--------------------------------+  |
+---------------------------------------------------------------------------------------------------------------+
          |                         |                       |                           |
          v                         v                       v                           v
+---------------------------------------------------------------------------------------------------------------+
|                                             CORE DOMAIN ENGINES                                               |
|   +-----------------------+     +------------------------+     +------------------------------------------+   |
|   |    PLANNER ENGINE     |     |    EXECUTION ENGINE    |     |             PAYMENT ENGINE               |   |
|   | - Gemini 2.5 Flash    | --> | - Sequential Runner    | --> | - x402 Handshake   - Wallet Signer      |   |
|   | - Plan Generator      |     | - Step Retries         |     | - Policy Evaluator - Facilitator Client  |   |
|   +-----------------------+     +------------------------+     +------------------------------------------+   |
|                                             |                                                                 |
|                                             v                                                                 |
|                                 +-----------------------+                                                     |
|                                 |   EXECUTOR REGISTRY   |                                                     |
|                                 | - Search Executor     |                                                     |
|                                 | - Financial Executor  |                                                     |
|                                 | - Summary Executor    |                                                     |
|                                 +-----------------------+                                                     |
+---------------------------------------------------------------------------------------------------------------+
          |                         |                       |                           |
          v                         v                       v                           v
+---------------------------------------------------------------------------------------------------------------+
|                                           DECOUPLED EVENT BUS & CACHE                                         |
|  - EventBus (Node EventEmitter)   - Execution Memory (Map<runId, Mem>)   - Analytics Cache (30s TTL)          |
+---------------------------------------------------------------------------------------------------------------+
          |                         |                       |                           |
          v                         v                       v                           v
+---------------------------------------------------------------------------------------------------------------+
|                                              PERSISTENCE LAYER                                                |
|  - User Repo      - Merchant Repo     - Policy Repo     - Transaction Repo    - AgentRun Repo    - Audit Repo |
|                                       MongoDB Replica Set                                                     |
+---------------------------------------------------------------------------------------------------------------+
```

### Subsystem Responsibilities & Rationale
* **API Gateway Layer**: Enforces boundary security, authenticates JWT tokens, generates unique `x-request-id` UUIDs for distributed tracing, and throttles rogue clients.
* **Application Services**: Thin orchestration layer mapping HTTP requests to domain models and returning standardized `ApiResponse` objects.
* **Planner Engine**: Utilizes Google Gemini 2.5 Flash to decompose fuzzy natural language queries into deterministic, type-safe execution step arrays without generating content answers.
* **Execution Engine**: Drives sequential execution of steps, invoking matching executors from the `ExecutorRegistry`, managing retries, and updating `AgentRun` state.
* **Payment Engine**: Intercepts step execution when HTTP 402 challenges are received, evaluates merchant and transaction validity against `Policy Guard`, signs authorization payloads, and handles settlement.
* **Executor Registry**: Decouples step execution logic from the core pipeline, enabling plug-and-play addition of new micro-service capabilities.
* **Decoupled Event Bus**: In-memory pub/sub framework eliminating tight coupling between payment, policy, timeline, socket, and audit logging services.

---

## 3. Layered Architecture & Boundary Rules

To ensure strict separation of concerns, the system enforces a strict 6-tier Layered Architecture with strict dependency flows.

```
  +-----------------------------------------------------------------------+
  | 1. PRESENTATION / CLIENT LAYER                                        |
  |    (Next.JS Frontend, Mobile Apps, External Webhooks)                 |
  +-----------------------------------------------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  | 2. API & GATEWAY LAYER                                                |
  |    (Express Routers, Middleware, Zod Validation, OpenAPI/Swagger)    |
  +-----------------------------------------------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  | 3. APPLICATION & SERVICE LAYER                                        |
  |    (ResearchService, PolicyService, MerchantService, DashboardService)|
  +-----------------------------------------------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  | 4. DOMAIN & CORE ENGINES LAYER                                        |
  |    (PlannerEngine, ExecutionEngine, PaymentEngine, PolicyEvaluator)   |
  +-----------------------------------------------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  | 5. REPOSITORY & DATA ACCESS LAYER                                     |
  |    (MerchantRepo, PolicyRepo, TransactionRepo, AgentRunRepo)          |
  +-----------------------------------------------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  | 6. INFRASTRUCTURE & EXTERNAL PROVIDERS LAYER                          |
  |    (MongoDB Atlas, Gemini Provider, Algorand SDK, Socket.IO Server)   |
  +-----------------------------------------------------------------------+
```

### Boundary & Dependency Rules
1. **Single-Direction Flow**: Requests MUST flow strictly downwards from Tier 1 to Tier 6. Reverse calls are strictly prohibited.
2. **Controller Isolation**: Controllers MUST NOT contain business logic, database queries, or direct event emissions. They MUST only parse requests, invoke services, and return `ApiResponse` objects.
3. **Repository Abstraction**: Services MUST NOT invoke Mongoose models directly. All database operations MUST pass through the Repository Layer.
4. **Event-Driven Upward Notifications**: Upward communication (e.g., notifying the UI of a step completion) MUST occur asynchronously through the `EventBus` and `Socket.IO` bridge, never via synchronous return chains.
5. **No Direct External Calls from Controllers**: Controllers MUST NOT invoke external APIs (Gemini, Algorand nodes, merchant endpoints) directly.

---

## 4. Component Specifications

| Component Name | Purpose | Inputs | Outputs | Primary Dependencies | Key Failure Modes |
|---|---|---|---|---|---|
| **API Gateway / Middleware** | Ingress security, auth, rate limiting, and request tracing. | Express `Request` | Augmented `Request` (`user`, `requestId`) | `helmet`, `jsonwebtoken`, `zod` | Token expiration (401), rate limit exceeded (429), validation failure (400). |
| **Planner Engine** | Generates multi-step JSON execution plans using Gemini AI. | User query string | Array of step objects (`id`, `type`, `input`) | `GeminiProvider`, `planner.prompt` | Gemini API timeout, invalid JSON output, quota exhaustion. |
| **Execution Engine** | Sequentially executes steps and manages retry lifecycles. | `runId`, step array | Final summary / step execution results | `ExecutorRegistry`, `MemoryService` | Step timeout, max retries exceeded, executor unhandled exception. |
| **Executor Registry** | Dynamic lookup container for step executors. | Step type string | Matching `IExecutor` instance | `SearchExecutor`, `FinancialExecutor`, etc. | Unregistered step type (falls back to default executor). |
| **Payment Manager** | Intercepts HTTP 402, evaluates policy, signs & settles payment. | 402 Challenge payload, merchant ID | Settlement tx hash, auth headers | `PolicyEvaluator`, `WalletManager`, `FacilitatorClient` | Policy violation (403), insufficient funds, wallet signing error, on-chain timeout. |
| **Policy Guard** | Evaluates cryptographic spending rules before transaction execution. | Transaction payload, Merchant ID, User ID | `PolicyDecision` (Approved / Denied + Reason) | `PolicyRepository`, `TransactionRepository` | Kill-switch active, budget ceiling exceeded, velocity limit exceeded, merchant blocked. |
| **Service Registry / Bazaar** | Discovers available paid API services and merchant endpoints. | Filter criteria (category, network) | Array of `ApiService` records | `ApiServiceRepository` | Service disabled, endpoint unresolvable. |
| **Wallet Manager** | Manages session keys, signs transactions, checks balances across chains. | Unsigned tx / message, chain ID | Signed transaction / Signature payload | `@algorandfoundation/algosdk`, `ethers` | Private key uninitialized, RPC node connectivity failure, invalid chain ID. |
| **Timeline Manager** | Logs chronological run events and streams telemetry. | `runId`, event name, step ID, metadata | Saved `TimelineEvent` document | `TimelineEventRepository`, `EventBus` | Database write lag, event serialization failure. |
| **Memory Manager** | Transient in-memory key-value store scoped per agent execution. | `runId`, step type, output payload | Consolidated `ExecutionMemory` object | In-memory `Map<string, ExecutionMemory>` | Memory leak if run cleanup fails (mitigated by explicit `clearMemory`). |

---

## 5. Payment Architecture

The Payment Architecture is the core financial engine of the platform. It intercepts micro-transaction requests, negotiates x402 HTTP challenges, enforces spending policies, signs transactions using abstracted keyrings, and submits settlements to public ledgers or facilitators.

```
                                +---------------------------+
                                |     EXECUTION ENGINE      |
                                +---------------------------+
                                              |
                                              | 1. Execute Paid Step
                                              v
                                +---------------------------+
                                |      PAYMENT MANAGER      |
                                +---------------------------+
                                              |
                                              | 2. Intercept HTTP 402 Challenge
                                              v
                                +---------------------------+
                                |   POLICY GUARD EVALUATOR  |
                                +---------------------------+
                                    /                   \
                        3a. Denied /                     \ 3b. Approved
                                  /                       \
                                 v                         v
                   +-----------------------+     +-------------------+
                   |   RECORD POLICY BLOCK |     |   WALLET MANAGER  |
                   | - Log Audit Trail     |     | - Sign Payload    |
                   | - Emit Socket Block   |     +-------------------+
                   +-----------------------+               |
                                                           | 4. Signed Tx
                                                           v
                                                 +-------------------+
                                                 | FACILITATOR CLIENT|
                                                 | (GoPlausible Node)|
                                                 +-------------------+
                                                           |
                                                           | 5. Submit Settlement
                                                           v
                                                 +-------------------+
                                                 | PUBLIC LEDGER     |
                                                 | (Algorand / EVM)  |
                                                 +-------------------+
                                                           |
                                                           | 6. Tx Hash & Confirmation
                                                           v
                                                 +-------------------+
                                                 | RECORD TRANSACTION|
                                                 | - Update Ledger   |
                                                 | - Emit EventBus   |
                                                 +-------------------+
```

### Component Responsibilities & Ownership
1. **Who owns payment?** `PaymentManager`. It orchestrates the lifecycle from 402 challenge detection to header injection.
2. **Who creates transactions?** `PaymentManager` constructs the initial `Transaction` database record with `PENDING` status.
3. **Who retries?** `PaymentManager` handles RPC resubmissions (up to 3 retries with exponential backoff).
4. **Who emits events?** `PaymentManager` emits `payment:requested`, `payment:approved`, `payment:denied`, and `payment:settled` to the `EventBus`.
5. **Who records audit?** `AuditService` listens to `EventBus` payment events and writes immutable `AuditLog` documents.
6. **Who updates dashboard?** `AnalyticsService` cache is invalidated on `payment:settled`, causing the next dashboard fetch to compute updated aggregations.
7. **Who updates AgentRun?** `ExecutionService` updates `AgentRun.totalCost`, `actualCost`, and step costs upon payment completion.

---

## 6. Payment State Machine

The payment lifecycle guarantees atomic state transitions. Transactions cannot jump states out of order, ensuring auditability and balance integrity.

```
       +-----------+
       | REQUESTED |
       +-----------+
             |
             v
   +-------------------+
   | POLICY_CHECKING   |
   +-------------------+
        /         \
       /           \
      v             v
+----------+   +----------+
| DENIED   |   | APPROVED |
+----------+   +----------+
                    |
                    v
              +----------+
              | SIGNING  |
              +----------+
                    |
                    v
              +-----------+
              | SUBMITTED |
              +-----------+
                    |
                    v
              +-----------+
              | SETTLING  |
              +-----------+
             /             \
            /               \
           v                 v
     +-----------+     +----------+
     |  SETTLED  |     |  FAILED  |
     +-----------+     +----------+
           |                 |
           v                 v
     +-----------+     +----------+
     | COMPLETED |     | RETRYING |
     +-----------+     +----------+
                             |
                             v
                       +-----------+
                       | CANCELLED |
                       +-----------+
```

### State Transition Table & Conditions

| Source State | Destination State | Event / Trigger | Pre-Conditions & Actions |
|---|---|---|---|
| `REQUESTED` | `POLICY_CHECKING` | 402 Challenge Intercepted | Parse 402 header (`scheme`, `amount`, `merchantAddress`). |
| `POLICY_CHECKING` | `APPROVED` | Policy Evaluator Success | `amount <= maxTxAmount`, `dailySpend + amount <= dailyBudget`, `killSwitch == false`, `merchant.status == Verified`. |
| `POLICY_CHECKING` | `DENIED` | Policy Evaluator Violation | Rule broken. Record `decisionReason`, log `POLICY_VIOLATION` audit entry. Terminal. |
| `APPROVED` | `SIGNING` | Keyring Dispatched | Retrieve session wallet private key from secure memory. |
| `SIGNING` | `SUBMITTED` | Signature Generated | Sign payload (EIP-712 / Algorand tx). Transmit to Facilitator / Node. |
| `SUBMITTED` | `SETTLING` | Mempool Acceptance | Transaction accepted into mempool. Tx Hash generated. |
| `SETTLING` | `SETTLED` | On-Chain Finality | Received 1+ block confirmations. Verify balance debit. |
| `SETTLING` | `FAILED` | Timeout / Rejection | Node rejected payload or timeout ($>30\text{s}$). |
| `FAILED` | `RETRYING` | Retry Policy Trigger | `retryCount < maxRetries`. Re-submit to alternate RPC endpoint. |
| `RETRYING` | `CANCELLED` | Max Retries Exceeded | Mark transaction `FAILED`, rollback step execution, emit `payment:failed`. |
| `SETTLED` | `COMPLETED` | Execution Resume | Inject Payment Auth Header into HTTP request to merchant API. Terminal. |

---

## 7. Execution State Machine

The AI agent execution engine operates on a strict state machine, maintaining high visibility for user interfaces via telemetry streaming.

```
                     +----------+
                     | QUEUED   |
                     +----------+
                          |
                          v
                     +----------+
                     | PLANNING |
                     +----------+
                          |
                          v
                     +----------+
                     | RUNNING  | <-------------------+
                     +----------+                     |
                       /      \                       |
                      /        \                      |
                     v          v                     |
       +------------------+   +-----------+           |
       | WAITING_PAYMENT  |   | EXECUTING |           |
       +------------------+   +-----------+           |
                 |                  |                 |
                 v                  v                 |
            +----------+      +-----------+           |
            | APPROVED |      | STEP_DONE | ----------+
            +----------+      +-----------+
                 |
                 v
            +-----------+
            |  SETTLED  |
            +-----------+
                 |
                 +-----------------+
                 |                 |
                 v                 v
           +-----------+     +----------+
           | COMPLETED |     |  FAILED  |
           +-----------+     +----------+
                                   |
                                   v
                             +-----------+
                             | CANCELLED |
                             +-----------+
```

### Execution States Description
* **`QUEUED`**: Research request received, `AgentRun` record initialized in MongoDB.
* **`PLANNING`**: `PlannerService` invoking Gemini 2.5 Flash to generate step array.
* **`RUNNING`**: Execution loop active, processing step sequence.
* **`WAITING_PAYMENT`**: Step execution paused while HTTP 402 challenge is being negotiated.
* **`EXECUTING`**: Executor actively processing step logic (Search, Financial, Summary).
* **`STEP_DONE`**: Step completed, output persisted to `ExecutionMemory`, moving to next step.
* **`COMPLETED`**: All steps finished successfully, final report persisted to `AgentRun`.
* **`FAILED`**: Critical error encountered, timeline updated, execution halted gracefully.
* **`CANCELLED`**: Execution terminated manually via user Kill-Switch or API request.

---

## 8. Sequence Diagrams

### 8.1 Successful Research Execution Flow
```
User            Router         ResearchSvc     PlannerSvc      Gemini        ExecutionSvc     Executor       EventBus       Socket.IO
 |                 |                |              |              |                |              |             |              |
 |-- POST /res --->|                |              |              |                |              |             |              |
 |<-- 200 {runId} -|                |              |              |                |              |             |              |
 |                 |-- Initiate --->|              |              |                |              |             |              |
 |                 |                |-- Generate ->|              |                |              |             |              |
 |                 |                |              |-- Prompt --->|                |              |             |              |
 |                 |                |              |<-- JSON -----|                |              |             |              |
 |                 |                |              |-- Emit(plan:generated) ----------------------------------->|              |
 |                 |                |              |                                                            |-- Emit ----->|
 |                 |                |-- Execute Plan ----------------------------->|              |             |              |
 |                 |                |              |                               |-- Execute ->|             |              |
 |                 |                |              |                               |<-- Output --|             |              |
 |                 |                |              |                               |-- Emit(step:completed) --->|              |
 |                 |                |              |                               |                            |-- Emit ----->|
 |                 |                |<-- Complete ---------------------------------|                            |              |
 |                 |                |-- Emit(research:completed) ------------------------------------------------>|              |
 |                 |                |                                                                           |-- Emit ----->|
```

### 8.2 Payment Challenge & Policy Enforcement Sequence
```
ExecutionSvc    PaymentMgr     PolicyEvaluator    WalletMgr     Facilitator     Ledger        AuditService    EventBus
     |               |                |               |              |             |               |             |
     |-- Step Req -->|                |               |              |             |               |             |
     |<-- HTTP 402 --|                |               |              |             |               |             |
     |               |-- Evaluate --->|               |              |             |               |             |
     |               |<-- Approved ---|               |              |             |               |             |
     |               |-- Request Sign --------------->|              |             |               |             |
     |               |<-- Signed Payload -------------|              |             |               |             |
     |               |-- Submit Settlement ------------------------->|             |               |             |
     |               |                                               |-- Broadcast>|               |             |
     |               |                                               |<-- Confirmed|               |             |
     |               |<-- Tx Hash & Receipt -------------------------|             |               |             |
     |               |-- Emit(payment:settled) --------------------------------------------------->|             |
     |               |                                                                             |-- Log Log ->|
     |<-- Resume ----|                                                                             |             |
```

### 8.3 Policy Rejection Sequence
```
ExecutionSvc    PaymentMgr     PolicyEvaluator   AuditService    EventBus       Socket.IO
     |               |                |               |             |               |
     |-- Step Req -->|                |               |             |               |
     |<-- HTTP 402 --|                |               |             |               |
     |               |-- Evaluate --->|               |             |               |
     |               |<-- DENIED -----| (Exceeds Cap) |             |               |
     |               |                |               |             |               |
     |               |-- Log Audit ------------------>|             |               |
     |               |-- Emit(policy:violation) ------------------->|               |
     |               |                                              |-- Broadcast ->|
     |<-- Abort Step-|                                                              |
```

---

## 9. Executor Framework & Extension Points

The platform uses a Plugin-based Executor Framework. Every external step capability inherits from `BaseExecutor` and registers with `ExecutorRegistry`.

```
                  +-----------------------------------+
                  |          <<interface>>            |
                  |            IExecutor              |
                  +-----------------------------------+
                  | + type: string                    |
                  | + supports(type: string): boolean |
                  | + execute(input, memory): Result  |
                  +-----------------------------------+
                                    ^
                                    |
                  +-----------------------------------+
                  |           BaseExecutor            |
                  +-----------------------------------+
                  | # createResult(success, output)   |
                  +-----------------------------------+
                    /               |               \
                   /                |                \
  +------------------+    +-------------------+    +------------------+
  |  SearchExecutor  |    | FinancialExecutor |    | SummaryExecutor  |
  +------------------+    +-------------------+    +------------------+
  | - Web Scraper    |    | - Market Quotes   |    | - LLM Synthesizer|
  | - Search APIs    |    | - SEC Filings     |    | - Report Format  |
  +------------------+    +-------------------+    +------------------+
```

### Registering New Executors (Extension Guide)
To introduce a new capability (e.g., `WeatherExecutor`, `SentimentExecutor`, `ImageExecutor`), engineers follow a 3-step plugin pattern:

1. **Extend BaseExecutor**:
```typescript
// Architectural Contract Pattern
export class WeatherExecutor extends BaseExecutor {
  readonly type = "WEATHER";
  
  async execute(input: ExecutorInput, memory: Record<string, unknown>): Promise<ExecutorResult> {
    // 1. Extract inputs
    // 2. Negotiate x402 payment if required
    // 3. Process API call
    // 4. Return standardized result
    return this.createResult(true, { temp: 22, condition: "Sunny" }, 0.01);
  }
}
```

2. **Register in ExecutorRegistry**:
```typescript
executorRegistry.register(new WeatherExecutor());
```

3. **Planner Inclusion**: Update `planner.prompt.ts` allowed step types list to include `"WEATHER"`. Zero changes required in `ExecutionService` or `ResearchService`.

---

## 10. Service Discovery & Bazaar Architecture

Service discovery bridges local API capabilities with external monetized endpoints published on the x402 Bazaar marketplace.

```
+-----------------------------------------------------------------------------------+
|                            SERVICE REGISTRY ARCHITECTURE                          |
|                                                                                   |
|  +---------------------------+                    +----------------------------+  |
|  |   LOCAL SERVICE REGISTRY  |                    |    X402 BAZAAR CATALOG     |  |
|  |   - MongoDB ApiService    | <--- Sync Engine - |    - Decentralized Registry|  |
|  |   - Static Endpoints      |                    |    - Dynamic Price Discovery|  |
|  +---------------------------+                    +----------------------------+  |
|                |                                                                  |
|                v                                                                  |
|  +-----------------------------------------------------------------------------+  |
|  |                     DYNAMIC DISCOVERY & RESOLUTION ENGINE                   |  |
|  |  - Route Query -> Best Endpoint (Lowest Latency / Price / Highest Rating)     |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Service Discovery Design
1. **Local Catalog**: Stored in `ApiService` Mongoose collection. Provides fast $<2\text{ms}$ lookup for endpoint URLs, network IDs, and base prices.
2. **Bazaar Marketplace Sync**: Background job periodically fetches published x402 merchant schemas from the decentralized Bazaar catalog and upserts local `ApiService` records.
3. **Endpoint Resolution**: When an executor runs, it queries `ApiServiceRepository.findByCategory(type)` and selects the optimal merchant endpoint based on price, latency, and Policy Guard allowlist status.

---

## 11. Multi-Chain Wallet Architecture

The wallet framework abstracts cryptographic signature generation across diverse blockchain standards, allowing agents to pay using ALGO, USDC on Base, Solana, or Polygon.

```
                            +-----------------------------+
                            |       WALLET MANAGER        |
                            +-----------------------------+
                                           |
                    +----------------------+----------------------+
                    |                      |                      |
                    v                      v                      v
        +----------------------+ +--------------------+ +-------------------+
        |   ALGORAND WALLET    | |     EVM WALLET     | |   SOLANA WALLET   |
        |   - Algorand SDK     | | - Ethers / Viem    | | - @solana/web3.js |
        |   - ASA / ALGO Sign  | | - EIP-712 / USDC   | | - SPL Token Sign|
        +----------------------+ +--------------------+ +-------------------+
```

### Unified Wallet Interface Specification
All blockchain wallet providers implement a unified interface:

```typescript
export interface IWalletProvider {
  readonly networkId: string; // e.g. "eip155:84532" or "algorand:testnet"
  getAddress(): string;
  getBalance(assetSymbol: string): Promise<number>;
  signTransaction(unsignedTx: unknown): Promise<string>;
  signPaymentAuthorization(challenge: x402Challenge): Promise<SignedAuthorization>;
}
```

---

## 12. Policy Guard Evaluation Pipeline

`Policy Guard` is a hard deterministic interception pipeline. Every transaction MUST pass all 7 evaluation stages sequentially. A failure at any stage immediately aborts evaluation with a `DENIED` policy decision.

```
[ Incoming Tx Request ]
          |
          v
+-------------------+
| 1. Kill-Switch    | ---> Active? ------------> [ DENIED: Global Kill-Switch Active ]
+-------------------+
          |
          v
+-------------------+
| 2. Merchant Status| ---> Blocked/Deleted? ---> [ DENIED: Merchant Address Not Allowed ]
+-------------------+
          |
          v
+-------------------+
| 3. Single Tx Cap  | ---> Amount > Limit? ----> [ DENIED: Exceeds Max Per-Tx Limit ]
+-------------------+
          |
          v
+-------------------+
| 4. Daily Budget   | ---> Today + Tx > Cap? --> [ DENIED: Exceeds Daily Budget Limit ]
+-------------------+
          |
          v
+-------------------+
| 5. Velocity Check | ---> Req/Min > Max? -----> [ DENIED: Velocity Limit Exceeded ]
+-------------------+
          |
          v
+-------------------+
| 6. Risk Scoring   | ---> Score > Threshold? -> [ DENIED: Anomaly Detection Triggered ]
+-------------------+
          |
          v
  [ APPROVE TX ]
```

---

## 13. Database Architecture & Data Design

MongoDB is configured with replica sets to enable multi-document ACID transactions where necessary (e.g., wallet balance deductions and transaction logging).

```
+------------------------------------------------------------------------------------+
|                               MONGODB DATABASE SCHEMA                              |
|                                                                                    |
|  +------------------+         +------------------+         +--------------------+  |
|  |      USERS       |         |    MERCHANTS     |         |     POLICIES       |  |
|  +------------------+         +------------------+         +--------------------+  |
|  | _id (PK)         | <----+  | _id (PK)         | <----+  | _id (PK)           |  |
|  | email (Unique)   |      |  | walletAddress    |      |  | merchant (FK,Uniq) |  |
|  | password (Hash)  |      |  | status           |      |  | dailyBudget        |  |
|  | role             |      |  | isDeleted        |      |  | transactionLimit   |  |
|  +------------------+      |  +------------------+      |  | version            |  |
|                            |                            |  +--------------------+  |
|  +------------------+      |  +------------------+      |                          |
|  |   AGENT_RUNS     |      |  |   TRANSACTIONS   |      |  +--------------------+  |
|  +------------------+      |  +------------------+      |  |    AUDIT_LOGS      |  |
|  | _id (PK)         |      |  | _id (PK)         |      |  +--------------------+  |
|  | user (FK) -------+------+  | merchant (Alias) |      |  | _id (PK)           |  |
|  | status           |         | status           |      |  | user (FK) ---------+  |
|  | steps []         |         | amount           |      |  | action             |  |
|  | plannerModel     |         | wallet (Address) |      |  | requestId          |  |
|  +------------------+         | txHash           |      |  | metadata           |  |
|                               +------------------+      |  +--------------------+  |
|  +------------------+                                   |                          |
|  | TIMELINE_EVENTS  |                                   |  +--------------------+  |
|  +------------------+                                   |  |    API_SERVICES     |  |
|  | _id (PK)         |                                   |  +--------------------+  |
|  | runId (Index)    |                                   +--| merchant (FK)      |  |
|  | event            |                                      | endpoint           |  |
|  | timestamp        |                                      +--------------------+  |
+------------------------------------------------------------------------------------+
```

### Essential Indexes for High-Throughput Scaling
```javascript
// Database Index Optimization Specification
db.merchants.createIndex({ walletAddress: 1, isDeleted: 1 });
db.policies.createIndex({ merchant: 1 }, { unique: true });
db.transactions.createIndex({ merchant: 1, createdAt: -1 });
db.transactions.createIndex({ status: 1, createdAt: -1 });
db.transactions.createIndex({ wallet: 1, createdAt: -1 });
db.timelineevents.createIndex({ runId: 1, timestamp: 1 });
db.auditlogs.createIndex({ createdAt: -1 });
db.auditlogs.createIndex({ action: 1 });
```

---

## 14. Event Architecture & Decoupled EventBus

The system relies on an in-memory `EventBus` (built on Node.js `EventEmitter`) to decouple core execution from telemetry, audit logging, and caching.

```
                       +------------------------+
                       |   EVENTBUS SINGLETON   |
                       +------------------------+
                                   |
         +-------------------------+-------------------------+
         |                         |                         |
         v                         v                         v
+------------------+      +------------------+      +------------------+
| SOCKET.IO BRIDGE |      |   AUDIT SERVICE  |      | ANALYTICS CACHE  |
+------------------+      +------------------+      +------------------+
| Broadcasts live  |      | Writes immutable |      | Invalidates 30s  |
| WebSockets events|      | AuditLog entry   |      | overview cache   |
| to browser UI    |      | to MongoDB       |      | on data mutations|
+------------------+      +------------------+      +------------------+
```

---

## 15. Socket.IO & Real-Time Streaming Architecture

Telemetry is streamed to the frontend over WebSockets using defined namespaces and room boundaries.

```
Client App
   |
   |-- Connect / (Main Namespace) ------> Subscribes to policy/merchant changes
   |
   |-- Connect /agent (Agent NS) -------> Subscribes to live step telemetry for runId
```

### Event Name Mapping Table

| Internal EventBus Event | Socket.IO Event Name | Target Namespace | Payload Structure |
|---|---|---|---|
| `EVENTS.RESEARCH_STARTED` | `research:started` | `/agent` | `{ runId, query, startedAt }` |
| `EVENTS.PLAN_GENERATED` | `plan:generated` | `/agent` | `{ runId, steps, model }` |
| `EVENTS.STEP_STARTED` | `step:started` | `/agent` | `{ runId, stepId, type, title }` |
| `EVENTS.STEP_COMPLETED` | `step:completed` | `/agent` | `{ runId, stepId, output, duration }` |
| `EVENTS.STEP_FAILED` | `step:failed` | `/agent` | `{ runId, stepId, error }` |
| `EVENTS.TIMELINE_UPDATE` | `timeline:update` | `/agent` | `{ runId, stepId, event, timestamp }` |
| `EVENTS.RESEARCH_COMPLETED`| `research:completed` | `/agent` | `{ runId, result, totalDuration }` |
| `EVENTS.POLICY_UPDATED` | `policy:updated` | `/` (Main) | `{ policy }` |
| `EVENTS.KILL_SWITCH_TOGGLED`| `policy:killSwitch` | `/` (Main) | `{ killSwitch }` |
| `EVENTS.DASHBOARD_REFRESH` | `dashboard:changed` | `/` (Main) | `{ reason }` |

---

## 16. Error Architecture & Exception Hierarchy

All system exceptions inherit from a base `ApplicationError` class, providing status codes and operational flags.

```
                      +-------------------+
                      |  ApplicationError |
                      +-------------------+
                        /               \
                       /                 \
        +-------------------+       +--------------------+
        |     ApiError      |       |   DomainError      |
        +-------------------+       +--------------------+
          /       |       \           /        |        \
         v        v        v         v         v         v
     +------+ +-------+ +------+ +-------+ +--------+ +--------+
     | Bad  | |  Un   | | Not  | |Planner| |Payment | | Policy |
     | Req  | | Auth  | | Found| | Error | | Error  | | Violat.|
     +------+ +-------+ +------+ +-------+ +--------+ +--------+
```

---

## 17. Security & Threat Model

```
+-----------------------------------------------------------------------------------+
|                              SECURITY THREAT MATRIX                               |
|                                                                                   |
|  [ PROMPT INJECTION ] ----> Intercepted by Planner JSON Enforcement & Schema      |
|  [ TREASURY DRAIN ]   ----> Intercepted by Policy Guard Daily Budget Ceilings    |
|  [ REPLAY ATTACK ]    ----> Intercepted by Nonce Check & EIP-712 Expiry Dates     |
|  [ ROGUE API LOOPS ]  ----> Intercepted by Max Transactions Per Minute Caps       |
|  [ MAN-IN-MIDDLE ]    ----> Intercepted by TLS 1.3 & Encrypted RPC Handshakes    |
+-----------------------------------------------------------------------------------+
```

---

## 18. Scalability & High Availability Architecture

```
                                  [ LOAD BALANCER / NGINX ]
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
        +--------------------+                              +--------------------+
        | EXPRESS WORKER #1  |                              | EXPRESS WORKER #2  |
        +--------------------+                              +--------------------+
        | - Stateless API    |                              | - Stateless API    |
        | - EventBus (Local) |                              | - EventBus (Local) |
        +--------------------+                              +--------------------+
                   |                                                   |
                   +-------------------------+-------------------------+
                                             |
                                             v
                                  [ REDIS PUB/SUB ADAPTER ]
                                             |
                                             v
                                  [ MONGODB REPLICA SET ]
```

---

## 19. Deployment & Infrastructure Topology

```
+-----------------------------------------------------------------------------------+
|                             PRODUCTION DEPLOYMENT                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | NGINX REVERSE PROXY / TLS TERMINATION (Port 443 -> 5000)                    |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | DOCKER CONTAINER: x402-backend (Node.js 22 LTS Process)                    |  |
|  |  - Express Server    - Socket.IO    - Pino Logger    - Swagger Engine       |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | MONGODB ATLAS CLUSTER (Primary + 2 Secondary Replicas w/ TLS 1.3)          |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 20. Future Architectural Roadmap

```
+-----------------------------------------------------------------------------------+
|                                 MILESTONE ROADMAP                                 |
|                                                                                   |
|  [ MILESTONE 1-3 ] Complete Infrastructure, Business APIs, & AI Execution Engine   |
|         |                                                                         |
|         v                                                                         |
|  [ MILESTONE 4 ] x402 Protocol Integration (GoPlausible, Algorand SDK, EVM 402)   |
|         |                                                                         |
|         v                                                                         |
|  [ MILESTONE 5 ] Decentralized Bazaar Discovery & Multi-Agent Swarms             |
|         |                                                                         |
|         v                                                                         |
|  [ MILESTONE 6 ] Enterprise Multi-Tenant Key Vaults & Autonomous MPC Signers     |
+-----------------------------------------------------------------------------------+
```

---
**Approved by:** Principal Software Architect  
**Distribution:** Engineering, Product, Security Operations
