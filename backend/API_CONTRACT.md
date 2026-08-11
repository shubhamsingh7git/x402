# x402 Policy Guard — Backend API Contract (v1)

This document specifies the complete REST API contract for the x402 Policy Guard backend. All endpoints adhere to standard JSON response envelopes and versioning under `/api/v1`.

---

## Global Response Envelopes

### Success Response Format (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Human-readable description of result",
  "data": {}
}
```

### Error Response Format (HTTP 400 / 401 / 403 / 404 / 409 / 500)
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific field error or validation error detail"]
}
```

---

## Authentication Requirements

All routes (except `/api/v1/health`, `/api/v1/auth/register`, and `/api/v1/auth/login`) require a valid JWT Bearer token passed in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints Reference

### 1. System & Health

#### `GET /api/v1/health`
- **Auth**: None
- **Response Data**: Server health status, uptime, environment.

---

### 2. AI Agent Research Pipeline (`/api/v1/research`)

#### `POST /api/v1/research`
- **Auth**: Bearer Token
- **Request Body**:
  ```json
  {
    "query": "Research Tesla AI Strategy"
  }
  ```
- **Response Data (200 OK - Synchronous Return)**:
  ```json
  {
    "runId": "66b1a2b3c4d5e6f7a8b9c0d9",
    "status": "started"
  }
  ```
- **Behavior**: Initiates background step execution pipeline (`PlannerService` $\rightarrow$ `ExecutionService` $\rightarrow$ `Executors` $\rightarrow$ `TimelineService` $\rightarrow$ `Socket.IO`).

#### `GET /api/v1/research/:runId`
- **Auth**: Bearer Token
- **Response Data (200 OK)**:
  ```json
  {
    "_id": "66b1a2b3c4d5e6f7a8b9c0d9",
    "query": "Research Tesla AI Strategy",
    "status": "completed",
    "plannerModel": "gemini-2.5-flash",
    "executionVersion": "1.0",
    "duration": 4,
    "totalDuration": 4200,
    "steps": [
      {
        "id": 1,
        "title": "Search Latest Web Intelligence on Tesla AI Strategy",
        "type": "SEARCH",
        "status": "completed",
        "duration": 800,
        "output": { ... }
      },
      {
        "id": 2,
        "title": "Extract Financial Metrics & Market Performance for Tesla AI Strategy",
        "type": "FINANCIAL_DATA",
        "status": "completed",
        "duration": 600,
        "output": { ... }
      },
      {
        "id": 3,
        "title": "Synthesize Fiduciary Report & Executive Summary for Tesla AI Strategy",
        "type": "SUMMARY",
        "status": "completed",
        "duration": 500,
        "output": { ... }
      }
    ],
    "startedAt": "2026-08-03T16:20:00.000Z",
    "completedAt": "2026-08-03T16:20:04.200Z"
  }
  ```

#### `GET /api/v1/research/:runId/timeline`
- **Auth**: Bearer Token
- **Response Data (200 OK)**: Array of timeline events (`RUN_CREATED`, `PLAN_STARTED`, `PLAN_COMPLETED`, `STEP_STARTED`, `STEP_COMPLETED`, `RUN_COMPLETED`).

#### `GET /api/v1/research/:runId/result`
- **Auth**: Bearer Token
- **Response Data (200 OK)**: Final synthesized executive report summary object.

---

### 3. AI Agent Research Endpoints (`/api/v1/research`)
- `POST /api/v1/research`: Initiates research pipeline (returns `{ runId, status: "started" }`).
- `GET /api/v1/research/:runId`: Fetches run state and steps array.
- `GET /api/v1/research/:runId/timeline`: Retrieves chronological timeline events.
- `GET /api/v1/research/:runId/result`: Retrieves synthesized executive report.

---

### 5. x402 Protocol & Algorand Blockchain Layer (`src/payment/algorand/`)
- **Real Payment Flow**:
  `Executor` $\rightarrow$ `PaymentManager` $\rightarrow$ `RealX402PaymentProvider` $\rightarrow$ `X402Client` $\rightarrow$ `WalletProvider` $\rightarrow$ `AuthorizationBuilder` $\rightarrow$ `GoPlausible Facilitator` $\rightarrow$ `Protected x402 API` $\rightarrow$ `Receipt` $\rightarrow$ `PaymentResult`.
- **Target Network**: Algorand TestNet (`NETWORK=testnet`, `USDC_ASSET_ID=10458941`, `X402_FACILITATOR_URL=https://facilitator.goplausible.com`).
- **Cryptographic Signatures**: `X402-ALGORAND-ED25519` payloads constructed via `AlgorandWalletProvider`.
- **ProtocolSession & Transaction Collections**: Captures `walletAddress`, `signatureType`, `authorizationPayload`, `facilitatorResponse`, `txHash`, `blockRound`, `settledAt`.
- **Socket.IO Telemetry Events**:
  - `wallet:connected`
  - `wallet:balance`
  - `payment:submitted`
  - `receipt:verified`
  - `facilitator:connected`

---

### 5. Policy Module (`/api/v1/policies`)
- `GET /api/v1/policies`
- `GET /api/v1/policies/:id`
- `POST /api/v1/policies` (Enforces `dailyBudget >= transactionLimit` and single policy per merchant)
- `PUT /api/v1/policies/:id` (Increments policy `version`)
- `DELETE /api/v1/policies/:id`

---

### 5. Transaction History (`/api/v1/transactions`)
- `GET /api/v1/transactions`
- `GET /api/v1/transactions/:id`

---

### 6. Audit Logging (`/api/v1/audit`)
- `GET /api/v1/audit`
- `GET /api/v1/audit/:id`

---

### 7. Dashboard Analytics (`/api/v1/dashboard`)
- `GET /api/v1/dashboard/overview` (Cached 30s)
- `GET /api/v1/dashboard/charts` (Cached 30s)

---

### 8. Agent Runs History (`/api/v1/agent-runs`)
- `GET /api/v1/agent-runs`
- `GET /api/v1/agent-runs/:id`
