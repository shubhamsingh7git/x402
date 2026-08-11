import { z } from "zod";

export const paymentRequestSchema = z.object({
  serviceId: z.string().optional(),
  merchantId: z.string().min(1, "merchantId is required"),
  endpoint: z.string().optional(),
  price: z.number().min(0, "price must be non-negative"),
  asset: z.string().optional().default("USDC"),
  network: z.string().optional().default("Base Sepolia Testnet"),
  scheme: z.string().optional().default("Exact"),
  executionId: z.string().optional(),
  runId: z.string().optional(),
  stepId: z.number().optional(),
  metadata: z.record(z.unknown()).optional().default({}),
});

export interface PaymentRequestDTO {
  serviceId?: string;
  merchantId: string;
  endpoint?: string;
  price: number;
  asset?: string;
  network?: string;
  scheme?: string;
  executionId?: string;
  runId?: string;
  stepId?: number;
  metadata?: Record<string, unknown>;
}
