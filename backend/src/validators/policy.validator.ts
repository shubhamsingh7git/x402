import { z } from "zod";

export const createPolicySchema = z
  .object({
    merchant: z.string().min(1, "Merchant ID is required"),
    dailyBudget: z.number().min(0, "Daily budget must be non-negative"),
    transactionLimit: z.number().min(0, "Transaction limit must be non-negative"),
    maxTransactionsPerMinute: z.number().min(1, "Max transactions per minute must be at least 1").optional().default(30),
    killSwitch: z.boolean().optional().default(false),
    enabled: z.boolean().optional().default(true),
  })
  .refine((data) => data.dailyBudget >= data.transactionLimit, {
    message: "Daily budget must be greater than or equal to transaction limit",
    path: ["dailyBudget"],
  });

export const updatePolicySchema = z
  .object({
    dailyBudget: z.number().min(0).optional(),
    transactionLimit: z.number().min(0).optional(),
    maxTransactionsPerMinute: z.number().min(1).optional(),
    killSwitch: z.boolean().optional(),
    enabled: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.dailyBudget !== undefined && data.transactionLimit !== undefined) {
        return data.dailyBudget >= data.transactionLimit;
      }
      return true;
    },
    {
      message: "Daily budget must be greater than or equal to transaction limit",
      path: ["dailyBudget"],
    }
  );

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
