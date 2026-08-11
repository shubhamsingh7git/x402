import { z } from "zod";
import { MERCHANT_STATUS } from "../constants/status";

export const createMerchantSchema = z.object({
  alias: z.string().min(2, "Alias must be at least 2 characters").trim(),
  walletAddress: z.string().min(4, "Wallet address is required").trim(),
  network: z.string().min(2, "Network is required").trim(),
  // status is explicitly omitted to prevent client status injection
});

export const updateMerchantSchema = z.object({
  alias: z.string().min(2).trim().optional(),
  walletAddress: z.string().min(4).trim().optional(),
  network: z.string().min(2).trim().optional(),
  status: z.nativeEnum(MERCHANT_STATUS as any).optional(),
});

export type CreateMerchantInput = z.infer<typeof createMerchantSchema>;
export type UpdateMerchantInput = z.infer<typeof updateMerchantSchema>;
