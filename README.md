# ⚡ x402 Agentic Commerce Platform

> **Enterprise-Grade AI Autonomous Agentic Payment, Governance PDP/PEP, Fiduciary Spend Policy Guard, Multi-Agent Orchestration, and Distributed Commerce Platform.**
> Built with Node.js, Express, TypeScript, MongoDB, Next.js 16 (App Router), React 19, Socket.IO, Algorand TestNet (USDC ASA ID `10458941`), x402 Protocol, and Google Gemini AI.

---

## 📋 Table of Contents

- [1. Executive Summary & Overview](#1-executive-summary--overview)
- [2. Core Problem Statement](#2-core-problem-statement)
- [3. Comprehensive Feature Matrix](#3-comprehensive-feature-matrix)
- [4. System Architecture & Component Topology](#4-system-architecture--component-topology)
- [5. End-to-End Request Lifecycle](#5-end-to-end-request-lifecycle)
- [6. Complete Technology Stack](#6-complete-technology-stack)
- [7. Repository Directory Structure](#7-repository-directory-structure)
- [8. Historical Milestone Evolution (Milestones 1–6.7)](#8-historical-milestone-evolution-milestones-167)
- [9. Autonomous Multi-Agent Collaboration (Milestone 5.5)](#9-autonomous-multi-agent-collaboration-milestone-55)
- [10. Enterprise Cognitive Intelligence (Milestone 5.6)](#10-enterprise-cognitive-intelligence-milestone-56)
- [11. Enterprise Control Plane & Multi-Tenancy (Milestone 6.1)](#11-enterprise-control-plane--multi-tenancy-milestone-61)
- [12. Distributed Infrastructure & Job Processing (Milestone 6.2)](#12-distributed-infrastructure--job-processing-milestone-62)
- [13. API Gateway & Service Mesh (Milestone 6.3)](#13-api-gateway--service-mesh-milestone-63)
- [14. Enterprise Observability & Telemetry (Milestone 6.4)](#14-enterprise-observability--telemetry-milestone-64)
- [15. Enterprise Security & Compliance Controls (Milestone 6.5)](#15-enterprise-security--compliance-controls-milestone-65)
- [16. Platform DevOps & Cloud Abstractions (Milestone 6.6)](#16-platform-devops--cloud-abstractions-milestone-66)
- [17. Production Readiness & Resilience (Milestone 6.7)](#17-production-readiness--resilience-milestone-67)
- [18. x402 Micropayment & Algorand Settlement Engine](#18-x402-micropayment--algorand-settlement-engine)
- [19. AI Service Marketplace & Capability Bazaar](#19-ai-service-marketplace--capability-bazaar)
- [20. Task Planner & Provider Selection Engine](#20-task-planner--provider-selection-engine)
- [21. Multi-Provider Execution Engine & Failover](#21-multi-provider-execution-engine--failover)
- [22. End-to-End Data Flow Diagrams](#22-end-to-end-data-flow-diagrams)
- [23. Complete REST API Endpoints Reference](#23-complete-rest-api-endpoints-reference)
- [24. WebSocket Real-Time Telemetry Events](#24-websocket-real-time-telemetry-events)
- [25. Database Architecture & Schema Roster](#25-database-architecture--schema-roster)
- [26. Frontend Application Architecture & Routes](#26-frontend-application-architecture--routes)
- [27. Frontend Performance Engineering & UI/UX System](#27-frontend-performance-engineering--uiux-system)
- [28. Environment Variables & Security Configuration](#28-environment-variables--security-configuration)
- [29. Installation & Local Development Guide](#29-installation--local-development-guide)
- [30. Build, Execution & Production Deployment](#30-build-execution--production-deployment)
- [31. Database Initialization & Seeder System](#31-database-initialization--seeder-system)
- [32. Verification, Testing & Quality Assurance](#32-verification-testing--quality-assurance)
- [33. Compliance Controls & Certification Disclaimer](#33-compliance-controls--certification-disclaimer)
- [34. Known Limitations & Development Assumptions](#34-known-limitations--development-assumptions)
- [35. Future Technical Roadmap](#35-future-technical-roadmap)
- [36. Architecture Decision Log](#36-architecture-decision-log)
- [37. Practical Troubleshooting Guide](#37-practical-troubleshooting-guide)
- [38. Bounded Context Enterprise Topology](#38-bounded-context-enterprise-topology)
- [39. Project Verification & Implementation Status](#39-project-verification--implementation-status)

---

## 1. Executive Summary & Overview

**x402 Agentic Commerce** is a full-stack, enterprise-grade autonomous payment, fiduciary policy enforcement, multi-agent orchestration, and service marketplace platform. It bridges autonomous AI capabilities with real-time monetary micro-transactions operating over HTTP `402 Payment Required` standards and on-chain crypto settlements.

### Dual-Perspective Platform Summary

#### 👤 User Perspective
From the user console perspective, x402 provides an intuitive, high-contrast Neobrutalist dashboard enabling enterprise operators, finance officers, and AI developers to:
- Monitor and control autonomous AI agent research runs and task plans in real time.
- Define granular, multi-tenant fiduciary spend policies (per-transaction spend caps, merchant daily budgets, transaction velocity limits, global emergency kill switches).
- Inspect live on-chain USDC payment receipts on Algorand TestNet alongside GoPlausible Facilitator verifications.
- Access an interactive service marketplace and capability bazaar for dynamic AI service discovery, provider comparison, and service selection.
- Manage enterprise multi-tenancy (Organizations, Workspaces, Projects, Teams, RBAC v2, Scoped API Keys, Encrypted Secrets, Feature Flags, Quotas).
- View complete operational telemetry: OpenTelemetry distributed traces, Pino log streams, Prometheus-compatible metrics, real-time alert triggers, incident triage, and compliance controls.

#### ⚙️ System Architecture Perspective
Architecturally, x402 is structured as a modular, event-driven TypeScript monolith backed by Express 4, Node.js, and MongoDB (75 Mongoose domain models). The system integrates:
1. **Policy Decision Point (PDP) & Policy Enforcement Point (PEP)**: Evaluates pre-execution spend constraints, risk scores, velocity limits, and kill-switch states before any cryptographic authorization header is issued.
2. **x402 Payment Engine**: Implements the `X402-ALGORAND-ED25519` cryptographic authorization scheme, settling micro-transactions in USDC (ASA ID `10458941`) on Algorand TestNet via `algosdk` and verifying receipts with the GoPlausible Facilitator (`https://facilitator.goplausible.com`).
3. **Agent Platform & Task Planner**: Combines Google Gemini AI (`gemini-2.5-flash`) for multi-step task decomposition with specialized agent profiles (Research, Financial, Policy, Summary, Executive, Compliance), shared session memory, and human-in-the-loop approval workflows.
4. **Multi-Provider Execution Engine**: Coordinates service execution across providers using configurable strategies (`SEQUENTIAL`, `PARALLEL`, `BALANCED`, `CONSENSUS`), backed by circuit breakers, fallbacks, and provider health monitors.
5. **Enterprise Control Plane, Distributed Queue & API Gateway**: Manages multi-tenant hierarchies, distributed job queues with Dead-Letter Queue (DLQ) replay, cron schedulers, dynamic gateway route mapping with zero-downtime hot reloads, and multi-layered middleware.

---

## 2. Core Problem Statement

Modern AI agent frameworks suffer from fundamental structural vulnerabilities when interfacing with real-world financial rails and paid API ecosystems:

1. **Unbounded Financial Risk**: Autonomous AI agents making direct API calls lack deterministic spending controls, leading to runaway costs, duplicated queries, or unauthorized API invocations.
2. **Fragmented Service Discovery & Selection**: No standardized mechanism exists for agents to dynamically discover, evaluate, rank, and select external API providers based on SLA metrics, price, reputation, and trust rules.
3. **Lack of Cryptographic Payment Verification**: Traditional web services rely on human-oriented credit card billing or subscription keys rather than machine-native, per-request cryptographic micropayment authorizations (`HTTP 402 Payment Required`).
4. **Missing Enterprise Governance & Multi-Tenancy**: AI agent deployments often lack organization-level isolation, granular Role-Based Access Control (RBAC), team-scoped API keys, rate limits, feature flags, and encrypted secret management.
5. **Opaque Operational Telemetry**: Debugging non-deterministic AI agent decisions without distributed trace IDs, structured logging, audit trails, and real-time WebSocket telemetry is impractical in production environments.

The **x402 Agentic Commerce Platform** directly solves these challenges by placing a Zero Trust Policy Guard between autonomous AI agents and paid external services, requiring cryptographic payment clearance on Algorand before execution.

---

## 3. Comprehensive Feature Matrix

Every feature listed below is verified in the repository implementation.

| Domain / Feature | Technical Capabilities | Implementation Status | Repository Verification |
|---|---|---|---|
| **x402 Micropayments** | `X402-ALGORAND-ED25519` header spec, ED25519 signature generation, GoPlausible Facilitator integration, USDC ASA settlement on Algorand TestNet | **Implemented** | `backend/src/payment/x402/`, `backend/src/payment/algorand/` |
| **Policy Guard (PDP/PEP)** | Spend limits per transaction, daily merchant budgets, velocity rate limits (max tx/min), global emergency kill switch | **Implemented** | `backend/src/security/PolicyDecisionPoint.ts`, `backend/src/services/policy/` |
| **Autonomous AI Planning** | Google Gemini AI (`@google/genai`), multi-step task decomposition (`SEARCH`, `FINANCIAL_DATA`, `SUMMARY`), step timeline ledger | **Implemented** | `backend/src/services/planner/`, `backend/src/services/research/` |
| **Capability Bazaar** | Canonical capability registry, dynamic candidate search, multi-criteria provider ranking (Rank, Latency, Price, Trust) | **Implemented** | `backend/src/bazaar/`, `backend/src/controllers/bazaar.controller.ts` |
| **Task Execution Engine** | Execution strategies (`SEQUENTIAL`, `PARALLEL`, `BALANCED`, `CONSENSUS`), Circuit Breakers, Provider Health Manager, Fallback Manager | **Implemented** | `backend/src/execution/`, `backend/src/services/execution/` |
| **AI Service Marketplace** | Provider profiles, SLA profiles, dynamic pricing policies, review collection, reputation engine recalculation | **Implemented** | `backend/src/marketplace/`, `backend/src/controllers/marketplace.controller.ts` |
| **Agent Platform** | Agent registry, specialized profiles, Agent Router, Shared Memory Manager, Message Bus, Governance evaluation, Human approval workflows | **Implemented** | `backend/src/agents/`, `backend/src/routes/agents.routes.ts` |
| **Enterprise Intelligence** | Knowledge Graph (nodes & edges), Long-Term Semantic Memory, Vector embedding abstraction, Offline Learning Engine, Optimization & Recommendation Engine | **Implemented** | `backend/src/intelligence/`, `backend/src/routes/intelligence.routes.ts` |
| **Control Plane & Multi-Tenancy** | Organizations, Workspaces, Projects, Teams, RBAC v2, Scoped API Keys, Encrypted Secrets Manager, Feature Flags, Quota Policies | **Implemented** | `backend/src/control-plane/`, `backend/src/controllers/controlplane.controller.ts` |
| **Distributed Processing** | Priority job queues (`CRITICAL`, `HIGH`, `DEFAULT`, `LOW`), Worker pool management, Dead-Letter Queue (DLQ) replay, Cron scheduler, Distributed event bus | **Implemented** | `backend/src/distributed/`, `backend/src/controllers/distributed.controller.ts` |
| **API Gateway & Service Mesh** | Microservice registry, dynamic route mapping, P50/P95/P99 latency tracking, hot reload, response caching, request correlation | **Implemented** | `backend/src/gateway/`, `backend/src/controllers/gateway.controller.ts` |
| **Enterprise Observability** | OpenTelemetry trace propagation (`TraceID`, `SpanID`), Pino structured logger, metrics aggregation, AlertManager, IncidentManager, SLO/SLA tracking | **Implemented** | `backend/src/observability/`, `backend/src/routes/observability.routes.ts` |
| **Enterprise Security** | Zero Trust PDP/PEP, KMS AES-256-GCM master key rotation, active session revocation, TOTP MFA setup, Compliance Engine (SOC2/ISO27001/GDPR readiness controls), Threat Detection | **Implemented** | `backend/src/security/`, `backend/src/routes/security.routes.ts` |
| **Platform DevOps Abstractions** | Kubernetes cluster roster models, deployment status, CI/CD pipeline engine, Helm release management, GitOps application sync status, HPA policies, Cluster backup & restore | **Implemented** | `backend/src/devops/`, `backend/src/routes/devops.routes.ts` |
| **Production Readiness Abstractions** | High Availability active-active topology models, regional failover simulation, chaos experiment execution, disaster recovery validation, release governance, operational runbooks | **Implemented** | `backend/src/production/`, `backend/src/routes/production.routes.ts` |
| **Real-time Telemetry** | Socket.IO event bridge mapping business domain events to WebSocket channels (`/agent` namespace & default namespace) | **Implemented** | `backend/src/socket/index.ts`, `backend/src/config/socket.ts` |
| **External Live Infra Manifests** | Cloud Terraform state files, live AWS/GCP Kubernetes cluster definitions outside code abstractions | **Planned** | External cloud configuration |

---

## 4. System Architecture & Component Topology

```text
                               ┌─────────────────────────────────────────┐
                               │           USER / OPERATOR               │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │        NEXT.JS 16 FRONTEND UI           │
                               │  (App Router, React 19, Zustand, R3F)   │
                               └────────────────────┬────────────────────┘
                                                    │ (REST / WebSockets)
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │         ENTERPRISE API GATEWAY          │
                               │  (Tenant Context, Auth, Rate Limits)    │
                               └────────────────────┬────────────────────┘
                                                    │
                   ┌────────────────────────────────┼────────────────────────────────┐
                   ▼                                ▼                                ▼
     ┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
     │  ENTERPRISE CONTROL PLANE │    │      TASK PLANNER         │    │      AGENT PLATFORM       │
     │ (Org, Workspace, RBAC,    │    │ (Decomposition, Strategy, │    │ (Registry, Router,        │
     │  API Keys, Secrets)       │    │  Provider Selection)      │    │  Memory, Approvals)       │
     └─────────────┬─────────────┘    └─────────────┬─────────────┘    └─────────────┬─────────────┘
                   │                                │                                │
                   └────────────────────────────────┼────────────────────────────────┘
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │    ENTERPRISE COGNITIVE INTELLIGENCE   │
                               │ (Knowledge Graph, Long-Term Memory,     │
                               │  Semantic Search, Learning & Recs)      │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │    PDP / PEP POLICY DECISION GUARD      │
                               │ (Transaction Caps, Daily Budget,        │
                               │  Velocity Limits, Emergency KillSwitch) │
                               └────────────────────┬────────────────────┘
                                                    │ (Policy Approved)
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │    MULTI-PROVIDER EXECUTION ENGINE      │
                               │ (Sequential, Parallel, Balanced,        │
                               │  Consensus, Fallback & Health Manager)  │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │   x402 PAYMENT & SETTLEMENT ENGINE      │
                               │ (ED25519 Signing, Algorand TestNet,     │
                               │  GoPlausible Facilitator Verification)  │
                               └────────────────────┬────────────────────┘
                                                    │
                   ┌────────────────────────────────┼────────────────────────────────┐
                   ▼                                ▼                                ▼
     ┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
     │  DISTRIBUTED QUEUE SYSTEM │    │ ENTERPRISE OBSERVABILITY  │    │ ENTERPRISE SECURITY & DEVOPS│
     │ (Jobs, Workers, DLQ,      │    │ (Traces, Logs, Metrics,   │    │ (KMS Key Rotation, MFA,   │
     │  Event Bus, Schedulers)   │    │  Alerts, Incidents, SLOs) │    │  Cluster Roster, GitOps)  │
     └───────────────────────────┘    └───────────────────────────┘    └───────────────────────────┘
```

---

## 5. End-to-End Request Lifecycle

The diagram and step breakdown below illustrate the flow of an enterprise operation (such as an autonomous multi-agent research task requiring paid API access):

```text
User Request ──► API Gateway ──► Auth & Tenant Verification ──► Task Planner ──► Agent Orchestrator
                                                                                       │
Execution Result ◄── Settlement ◄── Algorand / x402 ◄── Policy Guard (PDP/PEP) ◄───────┘
```

1. **Request Ingestion**: The user or autonomous service sends an HTTP `POST /api/v1/research` or `POST /api/v1/agents/orchestrate` payload containing the task prompt and budget constraints to the API Gateway.
2. **Context Resolution**: The API Gateway applies correlation middleware (`requestIdMiddleware`, `correlationMiddleware`), assigning unique `X-Request-ID` and `X-Correlation-ID` headers.
3. **Authentication & Multi-Tenant Evaluation**: `authMiddleware` validates the JWT bearer token. `tenantContextMiddleware` extracts tenant headers (`X-Organization-Id`, `X-Workspace-Id`) and checks scoped permissions via `RBACService` and quota limits via `QuotaService`.
4. **Task Decomposition**: `PlannerService` and `CapabilityPlanner` break down the high-level prompt into concrete sub-task steps (e.g., `SEARCH`, `FINANCIAL_DATA`, `SUMMARY`).
5. **Provider & Agent Selection**: `ProviderSelectionStrategy` queries `BazaarRegistry` and `MarketplaceService`, filtering providers by requested capability, SLA metrics, reputation score, and pricing. Concurrently, `AgentRouter` selects specialized agents (e.g., `FinancialAgent`, `PolicyAgent`).
6. **Governance & Risk Evaluation**: `GovernanceEngine` and `PolicyDecisionPoint` inspect the proposed action against configured policy rules (`PolicyModel`):
   - Per-transaction limit check ($ USD).
   - Merchant daily budget limit check.
   - Velocity rate limiting (max transactions per minute).
   - Global emergency kill-switch status.
   - If risk exceeds defined thresholds or policy demands human intervention, an `ApprovalRequest` is created, pausing execution until approved via `POST /api/v1/agents/approvals/:id/action`.
7. **Execution Scheduling**: `ExecutionOrchestrator` schedules task execution using the requested strategy (`SEQUENTIAL`, `PARALLEL`, `BALANCED`, `CONSENSUS`).
8. **Payment Clearance & x402 Header Generation**: `PaymentManager` invokes `X402ProviderFactory` to construct an `X-402-Authorization` challenge response containing ED25519-signed authorization parameters for Algorand TestNet.
9. **On-Chain Settlement & Facilitator Verification**: The micro-transaction in USDC (ASA ID `10458941`) is submitted via `algosdk` to Algorand TestNet. The transaction hash is sent to the GoPlausible Facilitator gateway for verification, returning a payment receipt.
10. **Provider Invocation & Output Capture**: Upon payment verification, `ProviderExecutor` invokes the target external service. Response payload metrics are recorded.
11. **Cognitive Memory & Knowledge Synthesis**: `LongTermMemory` stores step outputs as episodic/semantic memories. `KnowledgeGraph` connects newly discovered entities and edges. `LearningEngine` aggregates experience for optimization recommendations.
12. **Audit, Timeline & Telemetry Dispatch**: `TimelineEvent` records execution step metrics. `AuditLog` records security and administrative actions. `EventBus` broadcasts events (`payment:completed`, `execution:completed`) over Socket.IO to connected web clients.
13. **Final Response**: The API Gateway returns the synthesized result payload along with transaction receipts and execution metadata to the frontend.

---

## 6. Complete Technology Stack

### Frontend Dependencies (`frontend/package.json`)

| Package / Library | Version | Category / Purpose |
|---|---|---|
| `next` | `16.2.12` | React Framework (App Router, Turbopack) |
| `react` / `react-dom` | `19.2.4` | Core UI Render Engine |
| `typescript` | `^5` | Static Type Safety |
| `tailwindcss` / `@tailwindcss/postcss` | `^4` | Utility-First CSS Engine v4 |
| `lucide-react` | `^1.27.0` | Enterprise Icon System |
| `shadcn` / `@radix-ui/react-checkbox` | `^4.15.0` / `^1.3.11` | Accessible Headless UI Component Primitives |
| `framer-motion` | `^12.42.2` | Fluid Micro-Animations & Page Transitions |
| `gsap` | `^3.15.0` | High-Performance Timeline Animation Engine |
| `three` / `@types/three` | `^0.185.1` | 3D WebGL Canvas Engine |
| `@react-three/fiber` | `^9.6.1` | React Wrapper for Three.js Canvas |
| `@react-three/drei` | `^10.7.7` | High-Level Helpers & Controls for Three.js |
| `@react-three/postprocessing` | `^3.0.4` | Shaders & Visual Effects for 3D Scenes |
| `@xyflow/react` | `^12.11.2` | Interactive Node Graph Visualizations |
| `@tanstack/react-query` | `^5.101.4` | Asynchronous Data Fetching & Cache Synchronization |
| `zustand` | `^5.0.14` | Client-side Atomic State Management |
| `axios` | `^1.19.0` | HTTP Client for Backend REST API Communication |
| `socket.io-client` | `^4.8.3` | Real-Time WebSocket Telemetry Subscription |
| `recharts` | `^3.10.1` | Dynamic Interactive Analytics Charts |
| `react-hook-form` / `@hookform/resolvers` | `^7.83.0` / `^5.5.7` | Form Handling & Schema Validation |
| `zod` | `^3.25.76` | Runtime Schema Validation |
| `clsx` / `tailwind-merge` | `^2.1.1` / `^3.6.0` | Class Name Utility Concatenation |
| `next-themes` | `^0.4.6` | High-contrast Dark/Light Theme Switching |

### Backend Dependencies (`backend/package.json`)

| Package / Library | Version | Category / Purpose |
|---|---|---|
| `express` | `^4.21.2` | HTTP Web Framework |
| `typescript` | `^5.8.3` | Static Type Safety |
| `ts-node-dev` | `^2.0.0` | Live Hot-Reloading Development Server |
| `mongoose` | `^8.14.3` | MongoDB Object Data Modeling (ODM) |
| `algosdk` | `^3.1.1` | Algorand Blockchain SDK (USDC Micro-transactions) |
| `jsonwebtoken` | `^9.0.2` | JWT Token Generation & Authorization Verification |
| `bcrypt` | `^5.1.1` | Password Hashing & Security |
| `zod` | `^3.25.76` | Request Payload & Environment Variable Validation |
| `socket.io` | `^4.8.1` | Real-Time Bi-Directional Event Broadcasting |
| `helmet` | `^8.1.0` | HTTP Security Headers Guard |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing Management |
| `express-rate-limit` | `^7.5.0` | API Endpoint Rate Limiting Guard |
| `compression` | `^1.8.0` | Gzip HTTP Response Compression |
| `cookie-parser` | `^1.4.7` | HTTP Cookie Header Parser |
| `morgan` | `^1.10.0` | Development HTTP Request Logger |
| `pino` / `pino-pretty` | `^9.6.0` / `^13.0.0` | High-Speed Structured JSON Logging |
| `swagger-ui-express` / `swagger-jsdoc` | `^5.0.1` / `^6.2.8` | OpenAPI 3.0 Interactive API Documentation |
| `uuid` | `^11.1.0` | Unique Identifier Generation |
| `dotenv` | `^16.5.0` | Environment Variable Injection |

---

## 7. Repository Directory Structure

```text
x402-app/
├── README.md                           # Master Project Enterprise Documentation
├── backend/                            # Express + TypeScript + MongoDB Service Core
│   ├── .env.example                    # Backend Environment Template
│   ├── API_CONTRACT.md                 # REST API Specification Document
│   ├── ARCH_SPEC_v1.0.md               # Architecture Specification Document
│   ├── DEPLOYMENT_GUIDE.md             # Operational Deployment Guide
│   ├── package.json                    # Backend Dependencies & Scripts
│   ├── tsconfig.json                   # TypeScript Compiler Configuration
│   └── src/
│       ├── server.ts                   # Application Entrypoint & Socket.IO Initialization
│       ├── app.ts                      # Express Middleware & Route Mounting Core
│       ├── agents/                     # Milestone 5.5: Multi-Agent Orchestration & Governance
│       ├── bazaar/                     # Milestone 5.1: Capability Registry & Provider Ranking
│       ├── config/                     # Database, Socket, Swagger & Environment Config
│       ├── constants/                  # Event Names, API Prefix Constants
│       ├── control-plane/              # Milestone 6.1: Enterprise Multi-Tenancy & RBAC
│       ├── controllers/                # Express Route Controllers (23 Domain Controllers)
│       ├── core/                       # Core Abstractions & Interfaces
│       ├── devops/                     # Milestone 6.6: Platform DevOps & Supply Chain Models
│       ├── distributed/                # Milestone 6.2: Distributed Queues, Workers & Schedulers
│       ├── events/                     # System-wide EventBus Abstraction
│       ├── execution/                  # Milestone 5.3: Multi-Provider Execution Engine & Strategies
│       ├── gateway/                    # Milestone 6.3: API Gateway Topology & Route Discovery
│       ├── intelligence/               # Milestone 5.6: Knowledge Graph & Cognitive Memory
│       ├── interfaces/                 # Shared Backend Interfaces
│       ├── jobs/                       # Background Verification Cron Jobs
│       ├── marketplace/                # Milestone 5.4: AI Service Marketplace & Reputation Engine
│       ├── middleware/                 # Auth, Correlation, Rate Limit & Error Middlewares
│       ├── models/                     # 75 Mongoose Database Schemas
│       ├── observability/              # Milestone 6.4: OpenTelemetry Tracing, Alerts & Incidents
│       ├── payment/                    # Milestone 4: x402 Header Protocol & Algorand SDK Engine
│       ├── planner/                    # Milestone 5.2: Capability Planner & Strategy Selection
│       ├── production/                 # Milestone 6.7: Production HA, Chaos & DR Abstractions
│       ├── prompts/                    # Gemini AI System Prompts
│       ├── providers/                  # External Service Provider Integration Adapters
│       ├── repositories/               # Repository Access Pattern Layer
│       ├── routes/                     # 23 Express Endpoint Route Files
│       ├── security/                   # Milestone 6.5: Zero Trust PDP/PEP, KMS & Compliance
│       ├── seeders/                    # 11 Domain Database Seeders
│       ├── services/                   # Business Service Layer Classes
│       ├── socket/                     # Socket.IO Event Handler Bridges
│       ├── utils/                      # Logger, Crypto & Helper Utilities
│       └── validators/                 # Zod Request Validation Schemas
└── frontend/                           # Next.js 16 + React 19 + Tailwind CSS v4 Dashboard
    ├── .env.local                      # Frontend Environment Variables Template
    ├── next.config.ts                  # Next.js App Router Configuration
    ├── package.json                    # Frontend Dependencies & Scripts
    ├── tsconfig.json                   # TypeScript Compiler Configuration
    └── src/
        ├── app/                        # 31 App Router Pages & Sub-routes (105 total pages)
        ├── components/                 # React UI Components (Dashboard, Cards, Controls)
        ├── constants/                  # Navigation & System Constants
        ├── lib/                        # Zustand Stores, Axios API Clients, Socket Clients
        └── types/                      # Frontend TypeScript Definitions
```

---

## 8. Historical Milestone Evolution (Milestones 1–6.7)

The platform was built across 18 distinct engineering milestones. Every milestone has been verified against the current repository codebase:

```text
Milestone 1: Core Foundation (Express, TypeScript, Auth, DB)
  └─► Milestone 2: Policy Decision Point (PDP/PEP Spend Limits)
        └─► Milestone 3: Merchant Registry & Verification Engine
              └─► Milestone 4: x402 Micropayments & Algorand Settlement (4.1 - 4.3)
                    └─► Milestone 5: Service Marketplace & Multi-Agent Engine (5.1 - 5.6)
                          └─► Milestone 6: Enterprise Platform Infrastructure (6.1 - 6.7)
```

### Detailed Milestone Breakdown

| Milestone | Name & Focus | Key Backend & Database Additions | Key Frontend Additions | Verified Status |
|---|---|---|---|---|
| **M1** | Core Foundation & Auth | Express 4, TypeScript, MongoDB connection, JWT auth, bcrypt, basic error handling | Auth pages (`/login`, `/register`), Dashboard layout, Navbar, Sidebar | **Implemented** |
| **M2** | Spend Policy Guard (PDP/PEP) | `PolicyModel`, `PolicyService`, spend limit evaluation per tx, merchant budgets, kill switch | Policy management console (`/policies`), Spend charts, Kill-switch UI | **Implemented** |
| **M3** | Merchant Verification Engine | `MerchantModel`, `MerchantVerificationLog`, async verification background job | Merchant roster page (`/merchants`), Status indicators, Verification triggers | **Implemented** |
| **M4.1** | x402 Header Specification | `X402-ALGORAND-ED25519` cryptographic header format, ED25519 signature generator | x402 Header inspector modal, Security protocol viewer | **Implemented** |
| **M4.2** | Payment Challenge & Manager | `PaymentManager`, x402 challenge negotiation flow, transaction status machine | Transaction ledger (`/transactions`), Execution status indicators | **Implemented** |
| **M4.3** | Algorand & Facilitator Gateway | `algosdk` integration for USDC (ASA ID `10458941`), GoPlausible Facilitator API client | Real-time wallet telemetry panel, Transaction hash links | **Implemented** |
| **M5.1** | Capability Bazaar | `CapabilityModel`, `ProviderListingModel`, `BazaarRegistry`, dynamic provider search & ranking | Capability discovery portal (`/bazaar`, `/bazaar/discovery`, `/bazaar/providers`) | **Implemented** |
| **M5.2** | Task Planner Engine | `CapabilityPlanner`, `PlannerService`, `ProviderSelectionStrategy`, Gemini task decomposition | AI Planner interface (`/planner`), Multi-step task decomposition viewer | **Implemented** |
| **M5.3** | Multi-Provider Execution | `ExecutionEngine`, `CircuitBreaker`, `ProviderHealthManager`, `FallbackManager`, 4 execution strategies | Execution monitor dashboard (`/execution`), Live execution telemetry | **Implemented** |
| **M5.4** | AI Service Marketplace | `ProviderProfileModel`, `SLAProfileModel`, `PricingPolicyModel`, `ReputationEngine`, review recalculation | Marketplace portal (`/marketplace`, `/marketplace/providers`, `/marketplace/analytics`) | **Implemented** |
| **M5.5** | Multi-Agent Collaboration | `AgentProfileModel`, `AgentExecutionSessionModel`, `AgentRegistry`, `AgentOrchestrator`, `GovernanceEngine` | Agent management workspace (`/agents`, `/agents/registry`, `/agents/approvals`) | **Implemented** |
| **M5.6** | Cognitive Intelligence | `KnowledgeNodeModel`, `KnowledgeEdgeModel`, `SemanticMemoryModel`, `OptimizationRecommendationModel`, `LearningEngine` | Intelligence dashboard (`/intelligence`, `/intelligence/knowledge`, `/intelligence/memory`) | **Implemented** |
| **M6.1** | Enterprise Control Plane | `OrganizationModel`, `WorkspaceModel`, `ProjectModel`, `TeamModel`, `APIKeyModel`, `SecretModel`, `FeatureFlagModel` | Control plane management (`/control-plane`, `/control-plane/organizations`, `/control-plane/rbac`) | **Implemented** |
| **M6.2** | Distributed Infrastructure | `JobModel`, `QueueModel`, `WorkerModel`, `EventStoreModel`, Priority queues, DLQ replay, Cron scheduler | Distributed system dashboard (`/distributed`, `/distributed/jobs`, `/distributed/dead-letter`) | **Implemented** |
| **M6.3** | API Gateway & Mesh | `ServiceRegistryModel`, `RouteDefinitionModel`, `GatewayPolicyModel`, hot reload, P50/P95/P99 latency tracking | Gateway console (`/gateway`, `/gateway/routes`, `/gateway/services`, `/gateway/metrics`) | **Implemented** |
| **M6.4** | Enterprise Observability | `TraceModel`, `SpanModel`, `MetricModel`, `AlertModel`, `IncidentModel`, OpenTelemetry, AlertManager | Observability suite (`/observability`, `/observability/traces`, `/observability/incidents`) | **Implemented** |
| **M6.5** | Security & Compliance | `IdentityModel`, `SessionModel`, `MFADeviceModel`, `ThreatEventModel`, `CompliancePolicyModel`, KMS key rotation | Security management (`/security`, `/security/compliance`, `/security/threats`, `/security/keys`) | **Implemented** |
| **M6.6** | DevOps & Supply Chain | `ClusterModel`, `DeploymentModel`, `PipelineModel`, `GitOpsApplicationModel`, `SBOMModel`, Autoscaling | DevOps dashboard (`/devops`, `/devops/clusters`, `/devops/gitops`, `/devops/supply-chain`) | **Implemented** |
| **M6.7** | Production Readiness | `RegionModel`, `FailoverPolicyModel`, `ChaosExperimentModel`, `OperationalRunbookModel`, HA topology models | Production readiness console (`/production`, `/production/chaos`, `/production/readiness`) | **Implemented** |

---

## 9. Autonomous Multi-Agent Collaboration (Milestone 5.5)

Milestone 5.5 introduces autonomous multi-agent task execution, specialized agent delegation, shared session memory, and policy governance:

### Core Components
- **Agent Registry (`AgentRegistry.ts`)**: Central catalog of registered specialized agents (`ResearchAgent`, `FinancialAgent`, `PolicyAgent`, `SummaryAgent`, `ExecutiveAgent`, `ComplianceAgent`).
- **Agent Profiles (`AgentProfile.model.ts`)**: Database records defining agent capabilities, max token allocations, allowed tools, and cost caps.
- **Agent Router (`AgentRouter.ts`)**: Selects the optimal agent based on sub-task requirements and capability matching.
- **Shared Session Memory (`MemoryManager.ts` & `AgentMemory.model.ts`)**: Synchronizes context, intermediate results, and cross-agent findings during multi-agent runs.
- **Message Bus (`MessageBus.ts`)**: Internal pub/sub channel for real-time inter-agent messaging and status notifications.
- **Governance & Approvals (`GovernanceEngine.ts` & `ApprovalRequest.model.ts`)**: Evaluates policy constraints before agent actions. Creates human approval requests when risk bounds are exceeded.

### Multi-Agent Execution Flow

```text
Task Plan Ingestion ──► Agent Router ──► Specialized Agents Selection
                                               │
Agent Execution ◄── Human Approval (if required) ◄── Governance Evaluation ◄── Shared Session Memory
```

---

## 10. Enterprise Cognitive Intelligence (Milestone 5.6)

Milestone 5.6 adds enterprise cognitive intelligence, long-term memory retrieval, and self-optimizing recommendations:

### Architectural Subsystems
- **Knowledge Graph (`KnowledgeNode.model.ts` & `KnowledgeEdge.model.ts`)**: Stores entity relationships, domain taxonomies, and execution dependencies as a queryable graph.
- **Long-Term Memory (`SemanticMemory.model.ts` & `LongTermMemory.ts`)**: Persists episodic execution logs, procedural workflows, and semantic knowledge with vector embedding representations.
- **Embedding Abstraction (`IEmbeddingProvider.ts` & `DefaultEmbeddingProvider.ts`)**: Pluggable interface generating 1536-dimensional vector embeddings for semantic search.
- **Semantic Search Engine (`SemanticSearch.ts`)**: Computes cosine similarity across long-term memories to supply historical context to active agents.
- **Learning & Optimization Engine (`LearningEngine.ts` & `OptimizationEngine.ts`)**: Analyzes past task outcomes to detect bottlenecks, cost inefficiencies, and provider reliability anomalies.
- **Recommendation Engine (`OptimizationRecommendation.model.ts`)**: Generates actionable recommendations (Cost, Latency, Reliability, Security, Governance) requiring human operator approval before application.

---

## 11. Enterprise Control Plane & Multi-Tenancy (Milestone 6.1)

Milestone 6.1 establishes complete enterprise multi-tenancy, hierarchical organizational isolation, and administrative controls:

### Multi-Tenant Organizational Hierarchy

```text
Organization (Tenant Boundary)
  └── Workspace (Environment Scope)
       └── Project (Application Context)
            └── Team (User Group)
                 └── Users & Roles (RBAC v2 Permissions)
```

### Key Services
- **Organization & Workspace Isolation**: `OrganizationService.ts` and `WorkspaceService.ts` enforce strict data isolation using `tenantContextMiddleware.ts`.
- **RBAC v2 (`RBACService.ts` & `Role.model.ts`)**: Granular role-based permissions (`ORG_ADMIN`, `WORKSPACE_MEMBER`, `POLICY_MANAGER`, `AUDITOR`, `VIEWER`).
- **Scoped API Keys (`APIKeyService.ts` & `APIKey.model.ts`)**: Secret API keys bound to specific Organizations and Workspaces with expiration and scope restrictions.
- **Encrypted Secrets Manager (`SecretsManager.ts` & `Secret.model.ts`)**: AES-256-GCM encrypted storage for database credentials, API keys, and private wallet seed phrases.
- **Feature Flag Service (`FeatureFlagService.ts` & `FeatureFlag.model.ts`)**: Dynamic feature toggles targeting specific tenants or deployment environments.
- **Quota Management (`QuotaService.ts` & `QuotaPolicy.model.ts`)**: Enforces daily API request caps, transaction limits, and compute budgets per organization.

---

## 12. Distributed Infrastructure & Job Processing (Milestone 6.2)

Milestone 6.2 powers asynchronous, high-throughput task processing and event distribution:

### Asynchronous Execution Architecture
- **Priority Job Queues (`QueueManager.ts` & `Job.model.ts`)**: Four priority levels (`CRITICAL`, `HIGH`, `DEFAULT`, `LOW`) with configurable concurrency limits.
- **Worker Pools (`WorkerPool.ts` & `Worker.model.ts`)**: Autonomous background worker nodes with heartbeat monitoring and auto-recovery.
- **Retry Policies & Exponential Backoff (`RetryManager.ts`)**: Configurable max retry attempts with randomized exponential backoff delays.
- **Dead-Letter Queue & Replay (`DeadLetterQueue.ts`)**: Failed jobs exceeding retry thresholds are moved to the DLQ for manual inspection and one-click replay.
- **Task Scheduler (`Scheduler.ts` & `ScheduledTask.model.ts`)**: Cron-based background scheduler for periodic merchant verification, analytics aggregation, and memory cleanup.
- **Distributed Event Bus (`DistributedEventBus.ts` & `EventStore.model.ts`)**: Event sourcing store capturing all system events with correlation IDs and idempotency keys.

---

## 13. API Gateway & Service Mesh (Milestone 6.3)

Milestone 6.3 provides an enterprise entry point for routing, rate limiting, and service discovery:

### Gateway Components
- **Microservice Registry (`ServiceRegistry.ts` & `ServiceRegistry.model.ts`)**: Dynamic catalog of backend services, health status, and load distribution weights.
- **Dynamic Route Mapping (`RequestPipeline.ts` & `RouteDefinition.model.ts`)**: Maps external path patterns (e.g., `/api/v1/*`) to downstream service handlers with zero-downtime hot reloading.
- **Request Context & Tracing (`RequestContext.ts`)**: Attaches correlation IDs (`X-Correlation-Id`), tenant context, and timing marks to incoming requests.
- **Circuit Breakers & Retries (`GatewayPolicies.ts`)**: Automatically trips on elevated downstream error rates, redirecting traffic to fallback targets.
- **Response Caching (`GatewayCache.ts`)**: In-memory caching layer for high-frequency GET requests with automated cache invalidation hooks.
- **Latency Percentile Telemetry (`gatewayController.getMetrics`)**: Live P50, P95, and P99 latency percentiles and throughput analytics.

---

## 14. Enterprise Observability & Telemetry (Milestone 6.4)

Milestone 6.4 supplies deep operational visibility across all platform subsystems:

### Observability Stack
- **OpenTelemetry Tracing (`OpenTelemetryTracer.ts`, `Trace.model.ts`, `Span.model.ts`)**: End-to-end distributed tracing across API Gateway, Planner, Agents, Policy Guard, and Payment Engine.
- **Structured JSON Logging (`StructuredLogger.ts` & `LogEntry.model.ts`)**: Pino logger producing structured, context-enriched JSON logs with log level filtering (`debug`, `info`, `warn`, `error`, `fatal`).
- **Metrics Aggregation (`MetricsEngine.ts` & `Metric.model.ts`)**: System-wide performance counter and gauge aggregation (throughput, error rates, active socket connections, latency histograms).
- **AlertManager & Incident Management (`AlertManager.ts`, `IncidentManager.ts`, `Alert.model.ts`, `Incident.model.ts`)**: Real-time evaluation of metric thresholds, triggering alert notifications and opening incident triage tickets.
- **SLO / SLA Tracking (`ObservabilityConfig.ts`)**: Continuous monitoring of Service Level Objectives (SLOs), Service Level Agreements (SLAs), error budgets, Mean Time to Detect (MTTD), and Mean Time to Recover (MTTR).

---

## 15. Enterprise Security & Compliance Controls (Milestone 6.5)

Milestone 6.5 implements Zero Trust access controls, encryption, and automated compliance auditing:

### Security Subsystems
- **Zero Trust Policy Architecture (`PolicyDecisionPoint.ts`, `PolicyEnforcementPoint.ts`, `PolicyInformationPoint.ts`)**: Evaluates every operation against real-time security context before granting execution privileges.
- **KMS Encryption & Key Rotation (`EncryptionService.ts` & `securityController.rotateKeys`)**: Master AES-256-GCM key rotation for database secrets, field-level encryption, and key audit logs.
- **Active Session Revocation (`AuthenticationService.ts` & `Session.model.ts`)**: Real-time tracking of active user sessions with immediate remote session revocation capabilities.
- **Multi-Factor Authentication (`MFADevice.model.ts` & `securityController.mfaSetup`)**: Standard TOTP-based multi-factor authentication setup and verification.
- **Threat Detection Engine (`ThreatDetectionEngine.ts` & `ThreatEvent.model.ts`)**: Automated anomaly detection scanning for velocity spikes, unauthorized API access, and signature anomalies.
- **Continuous Compliance Engine (`ComplianceEngine.ts`, `CompliancePolicy.model.ts`, `ComplianceReport.model.ts`)**: Automated readiness reporting for SOC 2 Type II, ISO 27001, and GDPR technical controls.

---

## 16. Platform DevOps & Cloud Abstractions (Milestone 6.6)

Milestone 6.6 delivers software abstractions and data models for managing containerized workloads and release pipelines:

### Software Abstractions in Codebase
- **Kubernetes Cluster Roster (`ClusterManager.ts` & `Cluster.model.ts`)**: Tracks connected Kubernetes clusters, node pool capacities, namespaces, and cluster health.
- **Workload Deployment Engine (`DeploymentManager.ts` & `Deployment.model.ts`)**: Controls workload rollouts, replica scaling, container image tags, and zero-downtime rolling updates.
- **CI/CD Pipeline Engine (`PipelineEngine.ts` & `Pipeline.model.ts`)**: Monitors build jobs, automated test stages, image artifacts, and deployment approvals.
- **GitOps Application Sync (`GitOpsManager.ts` & `GitOpsApplication.model.ts`)**: Tracks GitOps repository synchronization state, target revisions, and drift detection.
- **HPA Autoscaling Policies (`Autoscaler.ts` & `AutoscalingPolicy.model.ts`)**: Defines CPU and memory utilization thresholds for automatic pod autoscaling.
- **Cluster Backup & Restore (`BackupManager.ts` & `BackupPolicy.model.ts`)**: Manages snapshot backup schedules, retention windows, and restore workflows.
- **DevSecOps Supply Chain & SBOM (`SBOMGenerator.ts`, `ImageSigningService.ts`, `SBOM.model.ts`, `ArtifactSignature.model.ts`)**: Generates Software Bill of Materials (SBOM) and verifies cryptographic container signatures.

---

## 17. Production Readiness & Resilience (Milestone 6.7)

Milestone 6.7 provides high-availability models, resilience testing tools, and operational runbooks:

### Production Readiness Capabilities
- **High Availability & Failover (`HighAvailabilityManager.ts`, `Region.model.ts`, `FailoverPolicy.model.ts`)**: Models multi-region Active-Active and Active-Passive cluster topologies with automated health replication.
- **Chaos Engineering Engine (`ChaosManager.ts` & `ChaosExperiment.model.ts`)**: Executes controlled fault injection experiments (latency injection, packet loss, worker termination, database disconnects) to measure system fault tolerance.
- **Disaster Recovery Validation (`RecoveryValidator.ts` & `DisasterRecoveryValidation.model.ts`)**: Automated testing of Recovery Point Objective (RPO) and Recovery Time Objective (RTO) metrics.
- **Performance Profiling (`PerformanceAnalyzer.ts` & `PerformanceReport.model.ts`)**: Benchmarks API response times, database query speeds, memory heap usage, and event loop lag.
- **Operational Runbooks (`OperationalRunbook.model.ts`)**: Integrated emergency response runbooks with step-by-step resolution procedures for on-call engineers.
- **Production Certification (`ProductionCertification.ts`)**: Evaluates system readiness against 50+ operational criteria before granting production release approval.

---

## 18. x402 Micropayment & Algorand Settlement Engine

The x402 Payment Engine provides machine-native micro-transaction capabilities over HTTP `402 Payment Required` standards:

### Core Architecture
- **`X-402-Authorization` Header Specification**: Encodes transaction parameters, nonce, timestamp, merchant recipient address, asset ID, and ED25519 cryptographic signature into an HTTP header string (`X402-ALGORAND-ED25519`).
- **Payment Manager (`PaymentManager.ts`)**: State machine handling payment lifecycle transitions (`CREATED`, `CHALLENGED`, `AUTHORIZED`, `SETTLING`, `COMPLETED`, `FAILED`, `DENIED`).
- **Algorand TestNet Settlement (`algosdk`)**: Submits USDC Asset Transfers (ASA ID `10458941`) on Algorand TestNet, returning immutable on-chain transaction hashes (`txHash`).
- **GoPlausible Facilitator Gateway**: Submits transaction payloads to `https://facilitator.goplausible.com` for off-chain receipt validation and merchant verification.
- **PDP Spend Enforcement**: Before any payment signature is generated, the Policy Decision Point enforces:
  1. Transaction Spend Limit ($ USD cap per request).
  2. Merchant Daily Budget (Cumulative 24-hour spend cap per merchant).
  3. Velocity Rate Limit (Max transaction count per minute).
  4. Global Kill Switch State.

---

## 19. AI Service Marketplace & Capability Bazaar

The platform maintains a dual-tier service discovery and monetization framework:

### 1. Capability Bazaar (Internal Agent Discovery)
- **Capability Registry (`Capability.model.ts`)**: Standardized directory of machine capabilities (e.g., `financial-analysis`, `web-search`, `data-summarization`, `sentiment-analysis`).
- **Dynamic Provider Ranking (`BazaarRanking.ts`)**: Ranks candidate service providers using a composite scoring formula:
  $$\text{Score} = w_1 \cdot \text{Reputation} + w_2 \cdot \frac{1}{\text{P95 Latency}} + w_3 \cdot \frac{1}{\text{Price}} + w_4 \cdot \text{TrustScore}$$
- **Search & Discovery API (`/api/v1/bazaar/search`)**: Allows autonomous agents and task planners to query ranked candidate providers in real time.

### 2. AI Service Marketplace (External Provider Ecosystem)
- **Provider Onboarding (`ProviderProfile.model.ts`)**: Self-service registration for third-party AI service vendors.
- **SLA Profiles (`SLAProfile.model.ts`)**: Binding Service Level Agreements defining uptime guarantees (e.g., 99.9%), max latency bounds, and error rate thresholds.
- **Pricing Policies (`PricingPolicy.model.ts`)**: Flexible pricing models (Flat-rate per request, tiered volume pricing, micro-metered per-token pricing).
- **Reputation Engine (`ReputationEngine.ts` & `Review.model.ts`)**: Collects user and agent reviews, automatically updating overall provider trust scores and ranking weights.

---

## 20. Task Planner & Provider Selection Engine

The Task Planner translates natural language user prompts into executable multi-step plans:

### Execution Plan Generation Lifecycle
1. **Prompt Ingestion**: `PlannerService` receives the user prompt and operational parameters.
2. **LLM Task Decomposition**: Google Gemini AI (`gemini-2.5-flash`) parses the prompt into logical execution steps with dependencies.
3. **Capability Matching**: `CapabilityPlanner` maps each step to required machine capabilities in the Bazaar.
4. **Provider Selection Strategy (`ProviderSelectionStrategy.ts`)**: Evaluates candidates against active selection policies:
   - `CHEAPEST`: Selects lowest-cost verified provider.
   - `FASTEST`: Selects lowest-latency provider.
   - `HIGHEST_REPUTATION`: Selects highest trust score provider.
   - `BALANCED`: Optimizes composite score across cost, latency, and trust.
5. **Execution Plan Output**: Generates an immutable `ExecutionPlan` payload containing step order, target endpoints, price caps, and retry parameters.

---

## 21. Multi-Provider Execution Engine & Failover

The Execution Engine executes multi-step plans across external providers with enterprise resilience:

### Execution Strategies (`ExecutionStrategyFactory.ts`)
- **`SEQUENTIAL`**: Executes sub-tasks one after another, passing output context down the chain.
- **`PARALLEL`**: Executes independent sub-tasks concurrently, aggregating results upon completion.
- **`BALANCED`**: Dynamically balances concurrency based on provider rate limits and latency SLAs.
- **`CONSENSUS`**: Dispatches the same query to multiple competing providers, resolving final answers via consensus voting (`ConsensusResolver.ts`).

### Resilience Mechanics
- **Circuit Breaker (`CircuitBreaker.ts`)**: Trips provider connections when failure rates cross defined error thresholds, preventing cascading timeouts.
- **Provider Health Manager (`ProviderHealthManager.ts`)**: Continuously pings provider endpoints, marking unhealthy nodes as inactive.
- **Fallback Manager (`FallbackManager.ts`)**: Automatically reroutes requests to secondary fallback providers if the primary provider fails.

---

## 22. End-to-End Data Flow Diagrams

### 1. Payment Flow
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend
    participant Gateway
    participant PDP as Policy PDP/PEP
    participant Payment as PaymentManager
    participant Algo as Algorand TestNet
    participant Fac as GoPlausible Facilitator

    User->>Frontend: Initiate Paid Operation
    Frontend->>Gateway: POST /api/v1/research (Bearer JWT)
    Gateway->>PDP: Evaluate Spend Policy & Budget Caps
    alt Policy Denied / Kill Switch Active
        PDP-->>Gateway: Policy Violation Exception
        Gateway-->>Frontend: HTTP 403 Forbidden
    else Policy Approved
        PDP->>Payment: Request x402 Clearance
        Payment->>Payment: Generate X402-ALGORAND-ED25519 Header
        Payment->>Algo: Submit USDC ASA Transfer (ASA 10458941)
        Algo-->>Payment: Return txHash
        Payment->>Fac: Verify Receipt (txHash)
        Fac-->>Payment: Receipt Verified
        Payment-->>Gateway: Authorization Cleared
        Gateway-->>Frontend: Return Operation Result & Receipt
    end
```

### 2. Agent Flow
```mermaid
sequenceDiagram
    autonumber
    participant Planner
    participant Router as Agent Router
    participant Agent as Specialized Agent
    participant Memory as Shared Memory
    participant Gov as Governance Engine
    participant Exec as Execution Engine

    Planner->>Router: Dispatch Sub-task Steps
    Router->>Agent: Assign Step to Specialized Agent
    Agent->>Memory: Fetch Context & Historical Memories
    Agent->>Gov: Evaluate Risk & Policy Bounds
    alt High Risk Detected
        Gov-->>Agent: Request Human Approval
    else Risk Within Bounds
        Gov-->>Agent: Governance Cleared
        Agent->>Exec: Trigger Provider Execution
        Exec-->>Agent: Execution Result Payload
        Agent->>Memory: Commit Step Outputs to Session Memory
    end
```

### 3. Distributed Job Flow
```mermaid
sequenceDiagram
    autonumber
    participant API as API Route
    participant Dispatcher
    participant Queue as Job Queue
    participant Worker as Worker Pool
    participant DLQ as Dead-Letter Queue

    API->>Dispatcher: Enqueue Job Payload
    Dispatcher->>Queue: Push to Priority Queue (CRITICAL/HIGH/DEFAULT)
    Queue->>Worker: Pull Job for Execution
    alt Job Succeeded
        Worker-->>Queue: Mark Job Completed
    else Job Failed (Retries Available)
        Worker-->>Queue: Re-queue with Exponential Backoff
    else Job Failed (Max Retries Exceeded)
        Worker->>DLQ: Move to Dead-Letter Queue
    end
```

---

## 23. Complete REST API Endpoints Reference

All endpoints are versioned under `/api/v1/*`. Interactive Swagger OpenAPI docs are served at `/docs` and `/api/docs`.

| Domain | HTTP Method | Endpoint Path | Description | Auth Required |
|---|---|---|---|---|
| **System** | `GET` | `/api/v1/health` | Comprehensive system health check | No |
| **System** | `GET` | `/api/v1/live` | Process liveness probe | No |
| **System** | `GET` | `/api/v1/ready` | Service readiness probe | No |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user account | No |
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate user & return JWT token | No |
| **Auth** | `GET` | `/api/v1/auth/me` | Fetch active user profile | Yes |
| **Research** | `POST` | `/api/v1/research` | Trigger AI multi-step research run | Yes |
| **Research** | `GET` | `/api/v1/research/runs` | List research runs history | Yes |
| **Research** | `GET` | `/api/v1/research/:runId` | Get research run details | Yes |
| **Research** | `GET` | `/api/v1/research/:runId/timeline` | Get run step execution timeline | Yes |
| **Research** | `GET` | `/api/v1/research/:runId/result` | Get synthesized final report | Yes |
| **Policies** | `GET` | `/api/v1/policies` | List spend policy rules | Yes |
| **Policies** | `POST` | `/api/v1/policies` | Create spend policy rule | Yes |
| **Policies** | `GET` | `/api/v1/policies/:id` | Get policy rule by ID | Yes |
| **Policies** | `PUT` | `/api/v1/policies/:id` | Update policy rule | Yes |
| **Policies** | `PATCH` | `/api/v1/policies/:id/toggle` | Toggle policy rule status | Yes |
| **Policies** | `PATCH` | `/api/v1/policies/:id/kill-switch` | Toggle global kill switch | Yes |
| **Policies** | `DELETE` | `/api/v1/policies/:id` | Delete policy rule | Yes |
| **Merchants** | `GET` | `/api/v1/merchants` | List cataloged merchants | Yes |
| **Merchants** | `POST` | `/api/v1/merchants` | Register new merchant | Yes |
| **Merchants** | `GET` | `/api/v1/merchants/:id` | Get merchant details | Yes |
| **Merchants** | `POST` | `/api/v1/merchants/:id/verify` | Trigger merchant verification | Yes |
| **Merchants** | `PUT` | `/api/v1/merchants/:id` | Update merchant details | Yes |
| **Merchants** | `DELETE` | `/api/v1/merchants/:id` | Soft delete merchant | Yes |
| **Transactions**| `GET` | `/api/v1/transactions` | Query micro-transaction ledger | Yes |
| **Transactions**| `GET` | `/api/v1/transactions/:id` | Get transaction details | Yes |
| **Audit** | `GET` | `/api/v1/audit` | Query system audit log entries | Yes |
| **Audit** | `GET` | `/api/v1/audit/:id` | Get audit log entry details | Yes |
| **Dashboard** | `GET` | `/api/v1/dashboard/overview` | Fetch overview dashboard metrics | Yes |
| **Dashboard** | `GET` | `/api/v1/dashboard/charts` | Fetch dashboard aggregated chart data | Yes |
| **Bazaar** | `GET` | `/api/v1/bazaar/overview` | Fetch Bazaar platform metrics | Yes |
| **Bazaar** | `GET` | `/api/v1/bazaar/search` | Search & rank candidate providers | Yes |
| **Bazaar** | `GET` | `/api/v1/bazaar/capabilities` | List canonical capabilities | Yes |
| **Bazaar** | `POST` | `/api/v1/bazaar/capabilities` | Create new capability | Yes |
| **Bazaar** | `GET` | `/api/v1/bazaar/providers` | List provider listings | Yes |
| **Bazaar** | `POST` | `/api/v1/bazaar/providers` | Create provider listing | Yes |
| **Planner** | `POST` | `/api/v1/planner/analyze` | Analyze prompt & generate plan | Yes |
| **Execution** | `GET` | `/api/v1/execution/metrics` | Get execution engine telemetry | Yes |
| **Execution** | `GET` | `/api/v1/execution/history` | Get multi-provider execution history | Yes |
| **Execution** | `POST` | `/api/v1/execution/test` | Trigger test multi-provider run | Yes |
| **Marketplace** | `GET` | `/api/v1/marketplace/analytics` | Fetch marketplace performance stats | Yes |
| **Marketplace** | `GET` | `/api/v1/marketplace/search` | Search marketplace providers | Yes |
| **Marketplace** | `POST` | `/api/v1/marketplace/providers` | Register provider profile | Yes |
| **Marketplace** | `POST` | `/api/v1/marketplace/reviews` | Post provider review & score | Yes |
| **Agents** | `GET` | `/api/v1/agents/registry` | List registered specialized agents | Yes |
| **Agents** | `POST` | `/api/v1/agents/orchestrate` | Trigger multi-agent orchestration | Yes |
| **Agents** | `GET` | `/api/v1/agents/approvals` | List pending human approvals | Yes |
| **Agents** | `POST` | `/api/v1/agents/approvals/:id/action`| Process approval decision | Yes |
| **Intelligence**| `GET` | `/api/v1/intelligence/search` | Natural language semantic search | Yes |
| **Intelligence**| `GET` | `/api/v1/intelligence/knowledge` | Fetch Knowledge Graph nodes/edges | Yes |
| **Intelligence**| `GET` | `/api/v1/intelligence/recommendations`| List optimization recommendations | Yes |
| **Control Plane**| `GET` | `/api/v1/control-plane/organizations`| List multi-tenant organizations | Yes |
| **Control Plane**| `POST` | `/api/v1/control-plane/api-keys` | Generate scoped API Key | Yes |
| **Control Plane**| `POST` | `/api/v1/control-plane/secrets` | Store or rotate encrypted secret | Yes |
| **Distributed** | `GET` | `/api/v1/distributed/jobs` | List distributed background jobs | Yes |
| **Distributed** | `POST` | `/api/v1/distributed/jobs` | Enqueue new job | Yes |
| **Distributed** | `POST` | `/api/v1/distributed/dead-letter/:id/replay`| Replay Dead-Letter Queue job | Yes |
| **Gateway** | `GET` | `/api/v1/gateway/routes` | Fetch dynamic gateway route map | Yes |
| **Gateway** | `POST` | `/api/v1/gateway/reload` | Hot reload gateway routing table | Yes |
| **Observability**| `GET` | `/api/v1/observability/traces` | Query OpenTelemetry traces | Yes |
| **Observability**| `GET` | `/api/v1/observability/incidents` | List operational incidents | Yes |
| **Security** | `GET` | `/api/v1/observability/threats` | List detected security threats | Yes |
| **Security** | `POST` | `/api/v1/security/keys/rotate` | Trigger KMS master key rotation | Yes |
| **DevOps** | `GET` | `/api/v1/devops/clusters` | List Kubernetes clusters roster | Yes |
| **DevOps** | `POST` | `/api/v1/devops/deploy` | Trigger progressive workload rollout | Yes |
| **Production** | `GET` | `/api/v1/production/readiness` | Fetch production readiness report | Yes |
| **Production** | `POST` | `/api/v1/production/chaos/run` | Trigger chaos engineering test | Yes |

---

## 24. WebSocket Real-Time Telemetry Events

The backend emits real-time telemetry events via Socket.IO over two main namespaces: `/` (default) and `/agent`.

```text
Backend EventBus ──► Socket.IO Bridge ──► Client WebSocket Listener ──► Zustand Store Update
```

### Registered Socket.IO Events (`backend/src/socket/index.ts`)

| Category | Event Name | Direction | Payload Contents |
|---|---|---|---|
| **Merchants** | `merchant:created` / `updated` / `deleted` | Server $\rightarrow$ Client | Merchant entity payload |
| **Payments** | `payment:created` / `approved` / `denied` / `completed` / `failed` | Server $\rightarrow$ Client | Transaction ID, amount, status, txHash |
| **x402 Protocol** | `x402:challenge` / `authorized` / `retry` / `negotiationCompleted` / `error` | Server $\rightarrow$ Client | Header challenge details, ED25519 status |
| **Algorand Telemetry** | `wallet:connected` / `balance` / `payment:submitted` / `receipt:verified` | Server $\rightarrow$ Client | Algorand wallet address, ASA balance, txHash |
| **Policies** | `policy:created` / `updated` / `deleted` / `policy:killSwitch` | Server $\rightarrow$ Client | Policy rule payload, global kill switch state |
| **Transactions & Audit**| `transaction:added` / `audit:created` | Server $\rightarrow$ Client | Transaction record, audit log entry |
| **Bazaar** | `bazaar:providerCreated` / `bazaar:capabilityCreated` | Server $\rightarrow$ Client | Bazaar provider listing, capability payload |
| **Planner & Execution**| `planner:executionPlanCreated` / `execution:started` / `execution:completed` | Server $\rightarrow$ Client | Execution plan ID, provider status, metrics |
| **Agent Platform** | `agent:registered` / `agent:started` / `approval:requested` / `approval:approved` | Server $\rightarrow$ Client | Agent session ID, approval request ID, status |
| **Intelligence** | `intelligence:memoryUpdated` / `intelligence:recommendationCreated` | Server $\rightarrow$ Client | Knowledge node update, recommendation ID |
| **Control Plane** | `controlplane:organizationCreated` / `controlplane:secretRotated` | Server $\rightarrow$ Client | Tenant ID, secret key ID |
| **Distributed** | `distributed:jobCreated` / `jobStarted` / `jobCompleted` / `deadLetterCreated` | Server $\rightarrow$ Client | Job ID, queue name, worker node ID, error |
| **Gateway** | `gateway:serviceRegistered` / `gateway:routeReloaded` | Server $\rightarrow$ Client | Route pattern, target service URL |
| **Observability** | `observability:traceStarted` / `observability:alertCreated` / `incidentOpened` | Server $\rightarrow$ Client | Trace ID, alert severity, incident ID |
| **Security** | `security:incidentCreated` / `security:threatDetected` / `security:keyRotated` | Server $\rightarrow$ Client | Threat severity, IP address, key version |
| **DevOps** | `devops:deploymentStarted` / `devops:rollbackStarted` / `backupCompleted` | Server $\rightarrow$ Client | Deployment name, cluster name, status |
| **Production** | `production:failoverTested` / `production:chaosRun` / `releaseApproved` | Server $\rightarrow$ Client | Chaos experiment ID, RPO/RTO metrics |
| **Agent Namespace** (`/agent`)| `research:started` / `step:started` / `research:completed` / `research:error` | Server $\rightarrow$ Client | Multi-step research run ID, step index, LLM report |

---

## 25. Database Architecture & Schema Roster

The platform uses MongoDB with Mongoose ODM, maintaining 75 structured domain models across 15 enterprise contexts:

| Enterprise Domain | Mongoose Model Files | Functional Purpose |
|---|---|---|
| **Auth & Security Core** | `User.ts`, `Identity.model.ts`, `Session.model.ts`, `MFADevice.model.ts` | Authentication, identity records, active session revocation, TOTP MFA devices |
| **Merchants & Payments** | `Merchant.ts`, `MerchantVerificationLog.ts`, `Transaction.ts`, `ProtocolSession.ts` | Merchant catalog, async verification logs, micro-transaction ledger, x402 sessions |
| **Policy Guard** | `Policy.ts`, `AuthorizationPolicy.model.ts` | Fiduciary spend policies, transaction caps, budget limits, PDP/PEP rules |
| **Audit & Timeline** | `AuditLog.ts`, `TimelineEvent.ts` | Immutable administrative audit trail, chronological step timeline events |
| **Agent Runs & Research** | `AgentRun.ts`, `ApiService.ts` | Multi-step Gemini AI research runs, registered external API service definitions |
| **Capability Bazaar** | `Capability.model.ts`, `ProviderListing.model.ts`, `ProviderReputation.model.ts` | Canonical capabilities, provider listings, dynamic bazaar ranking scores |
| **AI Service Marketplace**| `ProviderProfile.model.ts`, `SLAProfile.model.ts`, `PricingPolicy.model.ts`, `Review.model.ts` | Marketplace vendors, SLA guarantees, dynamic pricing rules, user reviews |
| **Multi-Agent Platform** | `AgentProfile.model.ts`, `AgentExecutionSession.model.ts`, `AgentMemory.model.ts`, `ApprovalRequest.model.ts` | Agent profiles, execution sessions, shared memory artifacts, human approval requests |
| **Cognitive Intelligence** | `KnowledgeNode.model.ts`, `KnowledgeEdge.model.ts`, `SemanticMemory.model.ts`, `OptimizationRecommendation.model.ts` | Knowledge Graph graph nodes/edges, long-term semantic memory, AI recommendations |
| **Control Plane** | `Organization.model.ts`, `OrganizationMember.model.ts`, `Workspace.model.ts`, `Project.model.ts`, `Team.model.ts`, `Role.model.ts`, `Invitation.model.ts`, `APIKey.model.ts`, `Secret.model.ts`, `FeatureFlag.model.ts`, `QuotaPolicy.model.ts` | Multi-tenancy hierarchy, RBAC permissions, scoped API keys, encrypted secrets, feature flags, tenant quotas |
| **Distributed System** | `Job.model.ts`, `Queue.model.ts`, `Worker.model.ts`, `ScheduledTask.model.ts`, `EventStore.model.ts` | Job queue instances, worker nodes, cron scheduled tasks, event store |
| **API Gateway & Mesh** | `ServiceRegistry.model.ts`, `RouteDefinition.model.ts`, `GatewayPolicy.model.ts` | Service mesh registry, dynamic gateway routes, rate limiting policies |
| **Observability** | `Trace.model.ts`, `Span.model.ts`, `Metric.model.ts`, `LogEntry.model.ts`, `Alert.model.ts`, `AlertRule.model.ts`, `Incident.model.ts` | OpenTelemetry traces & spans, metrics gauges, structured logs, alerts, incidents |
| **Security & Compliance** | `ThreatEvent.model.ts`, `SecurityIncident.model.ts`, `CompliancePolicy.model.ts`, `ComplianceReport.model.ts` | Security threat events, security incident tickets, compliance policies & reports |
| **DevOps & Production** | `Cluster.model.ts`, `Deployment.model.ts`, `Pipeline.model.ts`, `GitOpsApplication.model.ts`, `AutoscalingPolicy.model.ts`, `BackupPolicy.model.ts`, `SBOM.model.ts`, `ArtifactSignature.model.ts`, `Region.model.ts`, `FailoverPolicy.model.ts`, `ChaosExperiment.model.ts`, `DisasterRecoveryValidation.model.ts`, `PerformanceReport.model.ts`, `OperationalRunbook.model.ts` | Kubernetes cluster roster, deployment workloads, CI/CD pipelines, GitOps apps, HPA policies, backup schedules, SBOM supply chain signatures, regional failover topologies, chaos experiments, DR validations, performance reports, operational runbooks |

---

## 26. Frontend Application Architecture & Routes

Built on Next.js 16 App Router with React 19 and Tailwind CSS v4, the frontend contains 31 main app routes (over 105 distinct sub-pages):

| App Route Path | View Page Component | Primary Functional Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Main Platform Landing Page & Executive Gateway |
| `/login` | `src/app/login/page.tsx` | User Authentication Sign-In Console |
| `/register` | `src/app/register/page.tsx` | User Account Onboarding Registration |
| `/dashboard` | `src/app/dashboard/page.tsx` | Executive Command Center & Spend Telemetry |
| `/research` | `src/app/research/page.tsx` | AI Autonomous Multi-Step Research Launcher |
| `/policies` | `src/app/policies/page.tsx` | Spend Policy PDP/PEP & Kill-Switch Console |
| `/merchants` | `src/app/merchants/page.tsx` | Verified Merchant Registry & Verification Management |
| `/transactions` | `src/app/transactions/page.tsx` | x402 Micro-Transaction Ledger & Algorand Telemetry |
| `/audit` | `src/app/audit/page.tsx` | Administrative Audit Logs & Security Trail |
| `/bazaar` | `src/app/bazaar/page.tsx` | Capability Bazaar & Dynamic Provider Search |
| `/planner` | `src/app/planner/page.tsx` | Task Decomposition & Provider Strategy Planner |
| `/execution` | `src/app/execution/page.tsx` | Multi-Provider Execution Engine Telemetry |
| `/marketplace` | `src/app/marketplace/page.tsx` | AI Service Marketplace & Vendor Reputation Portal |
| `/agents` | `src/app/agents/page.tsx` | Multi-Agent Orchestration & Human Approval Console |
| `/intelligence` | `src/app/intelligence/page.tsx` | Cognitive Intelligence, Knowledge Graph & Recommendations |
| `/control-plane` | `src/app/control-plane/page.tsx` | Multi-Tenant Organizations, Workspaces, RBAC & API Keys |
| `/distributed` | `src/app/distributed/page.tsx` | Distributed Job Queues, Worker Pools & DLQ Replay |
| `/gateway` | `src/app/gateway/page.tsx` | API Gateway Topology, Dynamic Routes & Latency Stats |
| `/observability` | `src/app/observability/page.tsx` | OpenTelemetry Tracing, Pinot Logs, Alerts & Incidents |
| `/security` | `src/app/security/page.tsx` | Zero Trust Security, KMS Key Rotation, Threats & Compliance |
| `/devops` | `src/app/devops/page.tsx` | Kubernetes Cluster Roster, GitOps Sync & Supply Chain |
| `/production` | `src/app/production/page.tsx` | High Availability, Chaos Engineering & Production Readiness |
| `/analytics` | `src/app/analytics/page.tsx` | Advanced Spend Analytics & Executive Metrics |
| `/orchestrator` | `src/app/orchestrator/page.tsx` | Interactive Agent Orchestration Flow Canvas |
| `/reports` | `src/app/reports/page.tsx` | Exportable Executive Compliance & Cost Reports |
| `/services` | `src/app/services/page.tsx` | Registered External API Service Catalog |
| `/settings` | `src/app/settings/page.tsx` | Platform System Settings & Account Preferences |
| `/forbidden` | `src/app/forbidden/page.tsx` | HTTP 403 Access Denied Fallback Screen |
| `/unauthorized` | `src/app/unauthorized/page.tsx` | HTTP 401 Unauthorized Fallback Screen |
| `/session-expired`| `src/app/session-expired/page.tsx`| Session Expiration Fallback Screen |

---

## 27. Frontend Performance Engineering & UI/UX System

### 1. Neobrutalist UI/UX Design System
- **Crisp High-Contrast Borders**: Standardized `.glass-card-static`, `.glass-card`, and `.inner-box` containers matching the Dashboard source of truth across all 105 pages.
- **WCAG AA Accessible Palette**: Warm sand/cream background tokens in light mode, high-contrast dark charcoal text (`#2d2a26`), and `#2d2d2d` dark mode borders meeting 4.5:1 contrast standards.
- **Dynamic Visual Canvas**: Three.js WebGL particle backgrounds (`@react-three/fiber`) providing dynamic depth without blocking DOM thread interaction.

### 2. Rendering & Memory Optimization
- **Zustand Atomic Selectors**: Components consume isolated atomic store properties (`useAppStore(state => state.property)`), preventing unnecessary re-renders.
- **Memoized Components**: Heavy chart elements and data tables are wrapped with `React.memo` and `useCallback` hook references.
- **WebGL Resource Garbage Collection**: Explicit geometry, texture, and material disposal hooks on Three.js canvas unmounts prevent WebGL context leaks.
- **Passive Event Listeners**: All mouse move and scroll handlers use `{ passive: true }` to maintain smooth 60 FPS scrolling performance.

---

## 28. Environment Variables & Security Configuration

> ⚠️ **SECURITY DIRECTIVE**: Never commit `.env`, `.env.local`, seed phrases, or credentials to source control. Secret files are explicitly ignored in `.gitignore`.

### 1. Backend Environment Template (`backend/.env.example`)

```ini
# Server & Environment Configuration
PORT=5000
NODE_ENV=development

# Database Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/x402?retryWrites=true&w=majority

# JWT Token Secret (Minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Google Gemini AI Credentials
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=15000
GEMINI_MAX_RETRIES=2

# Payment & Simulation Configuration
PAYMENT_MODE=demo
PAYMENT_SIMULATION_DELAY=300
PAYMENT_DEFAULT_NETWORK=Algorand TestNet
PAYMENT_DEFAULT_ASSET=USDC

# Algorand TestNet Blockchain Credentials
NETWORK=testnet
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_TOKEN=
ALGOD_PORT=443
USDC_ASSET_ID=10458941
WALLET_MNEMONIC=your_25_word_algorand_seed_phrase_here

# x402 Facilitator Gateway URL
X402_FACILITATOR_URL=https://facilitator.goplausible.com

# Allowed Client Origin
CLIENT_URL=http://localhost:3000
```

### 2. Frontend Environment Template (`frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=x402 Agentic Commerce
```

---

## 29. Installation & Local Development Guide

### Prerequisites
- **Node.js**: `v18.x` or higher (Recommended `v20.x`)
- **npm**: `v9.x` or higher
- **MongoDB**: Local MongoDB community server or MongoDB Atlas cluster instance

### 1. Clone the Repository
```bash
git clone https://github.com/Ken-1412/x404.git
cd x402-app
```

### 2. Backend Setup & Local Start
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your valid MONGODB_URI and GEMINI_API_KEY

# Seed initial database records (Merchants, Policies, Bazaar, Agents, Intelligence, Control Plane)
npm run seed

# Start backend dev server with hot reload
npm run dev
```

The backend server will bootstrap on `http://localhost:5000`.

### 3. Frontend Setup & Local Start
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open `http://localhost:3000` in your web browser to access the management console.

---

## 30. Build, Execution & Production Deployment

### 1. Production Build Commands

#### Backend Compilation
```bash
cd backend
npm run build
```
This compiles TypeScript files from `src/` into standard JavaScript in `dist/`.

To start the production backend server:
```bash
npm start
```

#### Frontend Compilation
```bash
cd frontend
npm run build
```
This compiles Next.js App Router pages and assets into an optimized `.next` build output.

To start the production frontend server:
```bash
npm start
```

---

## 31. Database Initialization & Seeder System

The platform includes an automated seeder suite in `backend/src/seeders/` that runs on server bootstrap if collections are empty:

| Seeder Function | Source File | Seeded Data & Purpose | Execution Trigger |
|---|---|---|---|
| `seedBazaarData()` | `bazaar.seeder.ts` | Default canonical capabilities and provider listings | Automatic on `server.ts` start |
| `seedMarketplaceData()` | `marketplace.seeder.ts` | Default marketplace profiles, SLA profiles, reviews | Automatic on `server.ts` start |
| `seedAgentData()` | `agent.seeder.ts` | Default specialized AI agents (`Financial`, `Policy`, `Research`) | Automatic on `server.ts` start |
| `seedIntelligenceData()`| `intelligence.seeder.ts` | Default Knowledge Graph nodes, edges, long-term memory | Automatic on `server.ts` start |
| `seedControlPlaneData()`| `controlplane.seeder.ts` | Default Organization, Workspace, Project, RBAC roles | Automatic on `server.ts` start |
| `seedDistributedData()` | `distributed.seeder.ts` | Default queues (`CRITICAL`, `HIGH`), workers, tasks | Automatic on `server.ts` start |
| `seedGatewayData()` | `gateway.seeder.ts` | Default microservices topology and route definitions | Automatic on `server.ts` start |
| `seedObservabilityData()`| `observability.seeder.ts` | Default OpenTelemetry traces, metrics, alert rules | Automatic on `server.ts` start |
| `seedSecurityData()` | `security.seeder.ts` | Default security identities, compliance policies | Automatic on `server.ts` start |
| `seedDevOpsData()` | `devops.seeder.ts` | Default Kubernetes cluster roster, GitOps app states | Automatic on `server.ts` start |
| `seedProductionData()` | `production.seeder.ts` | Default HA region topologies, chaos test templates | Automatic on `server.ts` start |
| Manual CLI Seeder | `seed.ts` | Sample merchants, spend policies, and audit entries | Triggered via `npm run seed` |

---

## 32. Verification, Testing & Quality Assurance

### Testing Commands

#### 1. Code Style Linting
```bash
# Backend Linting
cd backend
npm run lint

# Frontend Linting
cd frontend
npm run lint
```

#### 2. Static Type Verification
```bash
# Backend Type Check
cd backend
npx tsc --noEmit

# Frontend Type Check
cd frontend
npx tsc --noEmit
```

#### 3. Route Unit Tests
```bash
cd backend
npx jest src/routes/__tests__
```

---

## 33. Compliance Controls & Certification Disclaimer

### Enterprise Compliance Readiness Framework
The platform incorporates technical security controls designed to support organization-level compliance readiness across three major frameworks:

1. **SOC 2 Type II Readiness**: Access logging, active session revocation, KMS AES-256-GCM encryption, granular RBAC v2, and immutable audit logs (`AuditLog.ts`).
2. **ISO 27001 Controls**: Risk-based authorization, threat detection scanning, automated key rotation, and vulnerability tracking.
3. **GDPR Compliance Tools**: Organization-level tenant isolation, data retention policies, and user session termination tools.

> ℹ️ **FORMAL CERTIFICATION DISCLAIMER**: The presence of technical compliance tooling, readiness reporting, and audit logging abstractions within this repository does **NOT** constitute formal third-party SOC 2, ISO 27001, or GDPR certification. Formal organizational certification requires independent audit validation by an accredited third-party auditor.

---

## 34. Known Limitations & Development Assumptions

Per the source-of-truth guidelines, the following development assumptions and limitations are explicitly documented:

1. **Blockchain Network**: On-chain payment settlement is configured for **Algorand TestNet** (USDC ASA ID `10458941`). MainNet deployment requires production wallet funding and MainNet node endpoints.
2. **Payment Mode Fallback**: In local development environments without Algorand TestNet API credentials, setting `PAYMENT_MODE=demo` enables simulated cryptographic payment authorizations.
3. **Infrastructure Abstractions**: DevOps and Production Readiness modules (Kubernetes clusters, Helm releases, GitOps sync, Chaos experiments) are implemented as **application-level software abstractions, API endpoints, data models, and UI panels**. Production deployment requires external cloud cluster provisioning.
4. **Vector Embedding Fallback**: In environments without active OpenAI/Gemini vector embedding keys, `DefaultEmbeddingProvider.ts` uses normalized hashing abstractions to generate 1536-dimensional mock vectors for semantic memory testing.

---

## 35. Future Technical Roadmap

Based on gaps identified in the current implementation, the following enhancements are planned for future releases:

- [ ] **Native Algorand MainNet Bridge**: Production-grade multi-sig Algorand wallet integration with hardware key support.
- [ ] **Cross-Chain Payment Adapters**: Extension of x402 protocol adapters to support Solana (USDC) and Base Sepolia (ERC-20).
- [ ] **External Cloud Infrastructure Controllers**: Native Terraform Cloud API and Kubernetes Operators sync engines for the Control Plane.
- [ ] **GraphQL Telemetry Mesh**: Subgraph API layer unifying Observability, Distributed Queues, and Agent Session state.

---

## 36. Architecture Decision Log

| Architectural Decision | Chosen Solution | Technical Rationale & Alternatives Considered |
|---|---|---|
| **Backend Framework** | Node.js + Express + TypeScript | Selected for rapid event-driven I/O, rich ecosystem support, and native TypeScript type safety across routes. |
| **Database Engine** | MongoDB + Mongoose ODM | Document-oriented schema flexibility ideal for storing non-deterministic AI agent outputs, dynamic multi-tenant policies, and event timelines. |
| **Frontend Framework** | Next.js 16 (App Router) + React 19 | Server-side rendering performance, Turbopack bundling speed, and layout routing hierarchy across 105 dashboard pages. |
| **Micropayment Standard** | x402 Protocol (`X402-ALGORAND-ED25519`) | Standardized `HTTP 402 Payment Required` header format enabling machine-native cryptographic micropayments. |
| **Blockchain Settlement** | Algorand TestNet (USDC ASA `10458941`) | Fast block finality (~3.3s), ultra-low transaction fees (~0.001 ALGO), and native ASA token support suitable for micro-transactions. |
| **Real-Time Telemetry** | Socket.IO Server & Client | Bi-directional WebSocket communication bridging internal `EventBus` domain events directly to web UI components. |
| **Policy Guard Pattern** | Zero Trust PDP / PEP Architecture | Separates policy evaluation logic (PDP) from execution enforcement (PEP), ensuring spend boundaries cannot be bypassed. |
| **AI LLM Provider** | Google Gemini AI (`@google/genai`, `gemini-2.5-flash`) | High-speed multi-step task planning, structured JSON schema outputs, and cost-effective execution for complex research runs. |

---

## 37. Practical Troubleshooting Guide

### 1. MongoDB Connection Issues
- **Symptom**: `MongoNetworkError: connect ECONNREFUSED` or server bootstrap failure.
- **Solution**: Verify your `MONGODB_URI` string in `backend/.env`. Ensure your local MongoDB server is running (`mongod`) or your MongoDB Atlas IP whitelist includes your local machine IP.

### 2. Backend Port Conflicts
- **Symptom**: `❌ Port 5000 is already in use by another process.`
- **Solution**: Terminate existing Node processes using port 5000:
  ```bash
  # Windows PowerShell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
  ```

### 3. Frontend WebSockets Disconnection
- **Symptom**: Telemetry indicators show "Disconnected" or Socket.IO connection errors.
- **Solution**: Confirm backend is running on `http://localhost:5000` and `NEXT_PUBLIC_SOCKET_URL` in `frontend/.env.local` matches the backend host URL.

### 4. Algorand TestNet API Timeouts
- **Symptom**: Payment authorization stalls during `SETTLING` status.
- **Solution**: Check `ALGOD_SERVER` status in `backend/.env`. If `testnet-api.algonode.cloud` is unresponsive, set `PAYMENT_MODE=demo` to enable local payment simulation.

### 5. JWT Authentication Failures
- **Symptom**: API endpoints return `HTTP 401 Unauthorized`.
- **Solution**: Ensure `JWT_SECRET` in `backend/.env` is at least 32 characters long. Log out and re-login via `/login` to generate a fresh JWT bearer token.

---

## 38. Bounded Context Enterprise Topology

```text
                        ┌──────────────────────────────────────────────┐
                        │                ENTERPRISE UI                 │
                        │ (Dashboard, Console, Visualizer, Analytics)  │
                        └──────────────────────┬───────────────────────┘
                                               │
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │             ENTERPRISE API GATEWAY           │
                        │    (Auth, Tenant Isolation, Rate Limits)     │
                        └──────────────────────┬───────────────────────┘
                                               │
        ┌──────────────────────────────────────┼──────────────────────────────────────┐
        ▼                                      ▼                                      ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐  ┌───────────────────────────────┐
│     ENTERPRISE CONTROL PLANE  │  │        TASK PLANNER           │  │        AGENT PLATFORM         │
│ (Org, Workspace, Project,     │  │ (Task Decomposition, Strategy,│  │ (Agent Registry, Router,      │
│  RBAC, API Keys, Secrets)     │  │  Provider Selection Engine)   │  │  Shared Memory, Approvals)    │
└───────────────────────────────┘  └───────────────┬───────────────┘  └───────────────┬───────────────┘
                                                   │                                  │
                                                   └─────────────────┬────────────────┘
                                                                     ▼
                                                   ┌──────────────────────────────────┐
                                                   │ ENTERPRISE COGNITIVE INTELLIGENCE│
                                                   │ (Knowledge Graph, Memory, Recs)  │
                                                   └─────────────────┬────────────────┘
                                                                     ▼
                                                   ┌──────────────────────────────────┐
                                                   │   PDP / PEP POLICY DECISION GUARD│
                                                   │ (Spend Limits, Budget, Velocity) │
                                                   └─────────────────┬────────────────┘
                                                                     ▼
                                                   ┌──────────────────────────────────┐
                                                   │  MULTI-PROVIDER EXECUTION ENGINE │
                                                   │ (Sequential, Parallel, Consensus)│
                                                   └─────────────────┬────────────────┘
                                                                     ▼
                                                   ┌──────────────────────────────────┐
                                                   │  x402 & ALGORAND PAYMENT ENGINE  │
                                                   │ (USDC ASA 10458941 Settlement)   │
                                                   └─────────────────┬────────────────┘
                                                                     │
        ┌────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┐
        ▼                                                            ▼                                                            ▼
┌───────────────────────────────┐                  ┌───────────────────────────────┐                  ┌───────────────────────────────┐
│  DISTRIBUTED INFRASTRUCTURE   │                  │    ENTERPRISE OBSERVABILITY   │                  │  SECURITY & DEVOPS PLATFORM   │
│ (Job Queues, Workers, DLQ,    │                  │ (OpenTelemetry Traces, Logs,  │                  │ (KMS Key Rotation, MFA,       │
│  Event Bus, Schedulers)       │                  │  Metrics, Alerts, Incidents)  │                  │  Cluster Roster, GitOps Sync) │
└───────────────────────────────┘                  └───────────────────────────────┘                  └───────────────────────────────┘
```

---

## 39. Project Verification & Implementation Status

## Project Status

The platform currently contains the complete implemented enterprise architecture through **Milestone 6.7**.

For the exact verification state of individual technical capabilities, domain models, and API endpoints, refer to the [3. Comprehensive Feature Matrix](#3-comprehensive-feature-matrix), [8. Historical Milestone Evolution](#8-historical-milestone-evolution-milestones-167), and [23. Complete REST API Endpoints Reference](#23-complete-rest-api-endpoints-reference) sections above.

All documented endpoints, database schemas, socket bridges, policy guards, and frontend routes represent verified code present in this repository.
