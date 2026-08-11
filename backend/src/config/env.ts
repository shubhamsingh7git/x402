import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // SERVER
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().default("http://localhost:3000"),

  // DATABASE
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // AUTH
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),

  // AI
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
  GEMINI_TIMEOUT_MS: z.string().default("15000"),
  GEMINI_MAX_RETRIES: z.string().default("2"),

  // MERCHANT VERIFICATION
  MERCHANT_VERIFICATION_TTL_MINUTES: z.string().default("5"),

  // PAYMENT & SIMULATION
  PAYMENT_MODE: z.enum(["demo", "dry-run", "protocol", "live"]).default("demo"),
  PAYMENT_SIMULATION_DELAY: z.string().default("300"),
  PAYMENT_RANDOM_FAILURE_RATE: z.string().default("0.0"),
  PAYMENT_RANDOM_LATENCY: z.string().default("50"),
  PAYMENT_DEFAULT_NETWORK: z.string().default("Base Sepolia Testnet"),
  PAYMENT_DEFAULT_ASSET: z.string().default("USDC"),

  // ALGORAND & FACILITATOR
  NETWORK: z.string().default("testnet"),
  ALGOD_SERVER: z.string().default("https://testnet-api.algonode.cloud"),
  ALGOD_TOKEN: z.string().default(""),
  ALGOD_PORT: z.string().default("443"),
  USDC_ASSET_ID: z.string().default("10458941"),
  WALLET_MNEMONIC: z.string().optional().default(""),
  X402_FACILITATOR_URL: z.string().default("https://facilitator.goplausible.com"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  const errors = parsed.error.flatten().fieldErrors;
  for (const [field, messages] of Object.entries(errors)) {
    console.error(`   - ${field}: ${(messages || []).join(", ")}`);
  }
  process.exit(1);
}

const data = parsed.data;

export const env = {
  // SERVER
  PORT: parseInt(data.PORT, 10),
  port: parseInt(data.PORT, 10),
  NODE_ENV: data.NODE_ENV,
  nodeEnv: data.NODE_ENV,
  CLIENT_URL: data.CLIENT_URL,
  clientUrl: data.CLIENT_URL,
  isProduction: data.NODE_ENV === "production",

  // DATABASE
  MONGODB_URI: data.MONGODB_URI,
  mongoUri: data.MONGODB_URI,

  // AUTH
  JWT_SECRET: data.JWT_SECRET,
  jwtSecret: data.JWT_SECRET,

  // AI
  GEMINI_API_KEY: data.GEMINI_API_KEY,
  GEMINI_MODEL: data.GEMINI_MODEL,
  GEMINI_TIMEOUT_MS: parseInt(data.GEMINI_TIMEOUT_MS, 10),
  GEMINI_MAX_RETRIES: parseInt(data.GEMINI_MAX_RETRIES, 10),

  // MERCHANT VERIFICATION
  MERCHANT_VERIFICATION_TTL_MINUTES: parseInt(data.MERCHANT_VERIFICATION_TTL_MINUTES, 10),

  // PAYMENT & SIMULATION
  PAYMENT_MODE: data.PAYMENT_MODE,
  PAYMENT_SIMULATION_DELAY: parseInt(data.PAYMENT_SIMULATION_DELAY, 10),
  PAYMENT_RANDOM_FAILURE_RATE: parseFloat(data.PAYMENT_RANDOM_FAILURE_RATE),
  PAYMENT_RANDOM_LATENCY: parseInt(data.PAYMENT_RANDOM_LATENCY, 10),
  PAYMENT_DEFAULT_NETWORK: data.PAYMENT_DEFAULT_NETWORK,
  PAYMENT_DEFAULT_ASSET: data.PAYMENT_DEFAULT_ASSET,

  // ALGORAND & FACILITATOR
  NETWORK: data.NETWORK,
  ALGOD_SERVER: data.ALGOD_SERVER,
  ALGOD_TOKEN: data.ALGOD_TOKEN,
  ALGOD_PORT: parseInt(data.ALGOD_PORT, 10),
  USDC_ASSET_ID: parseInt(data.USDC_ASSET_ID, 10),
  WALLET_MNEMONIC: data.WALLET_MNEMONIC,
  X402_FACILITATOR_URL: data.X402_FACILITATOR_URL,
} as const;
