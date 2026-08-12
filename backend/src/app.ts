import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { correlationMiddleware } from "./middleware/correlation.middleware";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import { API_PREFIX, API_ROUTES } from "./constants/api";

// Routes
import authRoutes from "./routes/auth.routes";
import merchantRoutes from "./routes/merchant.routes";
import policyRoutes from "./routes/policy.routes";
import transactionRoutes from "./routes/transaction.routes";
import auditRoutes from "./routes/audit.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import agentRunRoutes from "./routes/agentRun.routes";
import researchRoutes from "./routes/research.routes";
import apiServiceRoutes from "./routes/apiService.routes";
import bazaarRoutes from "./routes/bazaar.routes";
import plannerRoutes from "./routes/planner.routes";
import executionRoutes from "./routes/execution.routes";
import marketplaceRoutes from "./routes/marketplace.routes";
import agentRoutes from "./routes/agents.routes";
import intelligenceRoutes from "./routes/intelligence.routes";
import controlPlaneRoutes from "./routes/controlplane.routes";
import distributedRoutes from "./routes/distributed.routes";
import gatewayRoutes from "./routes/gateway.routes";
import observabilityRoutes from "./routes/observability.routes";
import securityRoutes from "./routes/security.routes";
import devopsRoutes from "./routes/devops.routes";
import productionRoutes from "./routes/production.routes";
import healthRoutes, { healthController } from "./routes/health.routes";

const app = express();



// ─── Global Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.clientUrl || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(correlationMiddleware);
app.use(requestIdMiddleware);

// HTTP request logging (dev only)
if (!env.isProduction) {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use(limiter);

// ─── Swagger Docs (Mounted at both /docs and /api/docs) ─────────
const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "x402 Policy Guard API Docs",
};
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// ─── API Routes (versioned under /api/v1/*) ──────────────────────
app.use(`${API_PREFIX}${API_ROUTES.HEALTH}`, healthRoutes);
app.get(`${API_PREFIX}/live`, (req, res) => healthController.liveness(req, res));
app.get(`${API_PREFIX}/ready`, (req, res) => healthController.readiness(req, res));

// Top-level aliases (/api/health, /api/live, /api/ready)
app.use("/api/health", healthRoutes);
app.get("/api/live", (req, res) => healthController.liveness(req, res));
app.get("/api/ready", (req, res) => healthController.readiness(req, res));

app.use(`${API_PREFIX}${API_ROUTES.AUTH}`, authRoutes);
app.use(`${API_PREFIX}/merchants`, merchantRoutes);
// Standardize on /policies and keep /policy as backward-compatible alias
app.use(`${API_PREFIX}/policies`, policyRoutes);
app.use(`${API_PREFIX}${API_ROUTES.POLICY}`, policyRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}${API_ROUTES.AUDIT}`, auditRoutes);
app.use(`${API_PREFIX}${API_ROUTES.DASHBOARD}`, dashboardRoutes);
app.use(`${API_PREFIX}/agent-runs`, agentRunRoutes);
app.use(`${API_PREFIX}/research`, researchRoutes);
app.use(`${API_PREFIX}/services`, apiServiceRoutes);
app.use(`${API_PREFIX}/bazaar`, bazaarRoutes);
app.use(`${API_PREFIX}/planner`, plannerRoutes);
app.use(`${API_PREFIX}/execution`, executionRoutes);
app.use(`${API_PREFIX}/marketplace`, marketplaceRoutes);
app.use(`${API_PREFIX}/agents`, agentRoutes);
app.use(`${API_PREFIX}/intelligence`, intelligenceRoutes);
app.use(`${API_PREFIX}/control-plane`, controlPlaneRoutes);
app.use(`${API_PREFIX}/distributed`, distributedRoutes);
app.use(`${API_PREFIX}/gateway`, gatewayRoutes);
app.use(`${API_PREFIX}/observability`, observabilityRoutes);
app.use(`${API_PREFIX}/security`, securityRoutes);
app.use(`${API_PREFIX}/devops`, devopsRoutes);
app.use(`${API_PREFIX}/production`, productionRoutes);

// ─── 404 & Error Handlers ──────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
