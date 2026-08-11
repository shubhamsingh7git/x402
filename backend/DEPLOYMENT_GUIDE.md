# x402 Autonomous Policy Guard — Production Deployment Guide (RC1)

**Release:** Release Candidate 1 (v1.0.0-rc1)  
**Target Environment:** Node.js 20+ LTS / Docker / Kubernetes / Cloud Run  

---

## 1. Environment Configuration Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure required environment variables in `.env`:
   - `MONGODB_URI`: Connection URI for your MongoDB cluster.
   - `JWT_SECRET`: Secret key for signing JWT tokens (min 8 chars).
   - `GEMINI_API_KEY`: API key for Gemini LLM planner (optional; fallback planner activates if omitted).

---

## 2. Database Seeding & Setup

To initialize database indexes, sample merchants, and default policies:
```bash
npm run seed
```

---

## 3. Production Build & Execution

1. Compile TypeScript source code to JavaScript bundle:
   ```bash
   npm run build
   ```

2. Start the production HTTP & Socket.IO server:
   ```bash
   npm run start
   ```

---

## 4. Health Check & Observability Monitoring

The server exposes three standard monitoring probes:
- `GET /api/health`: Deep system health report (inspects MongoDB, Algorand node, GoPlausible Facilitator, Gemini API, EventBus).
- `GET /api/live`: Liveness probe for Kubernetes / container orchestrators.
- `GET /api/ready`: Readiness probe verifying database connectivity and wallet state.

---

## 5. Automated Verification & Testing

Execute the comprehensive Release Candidate 1 (RC1) system integration & load test suite:
```bash
npx ts-node src/tests/rc1.test.ts
```
