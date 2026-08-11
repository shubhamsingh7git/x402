import { z } from "zod";

export const researchSchema = z.object({
  query: z
    .string()
    .min(3, "Query must be at least 3 characters")
    .max(500, "Query must not exceed 500 characters")
    .trim(),
});

export type ResearchInput = z.infer<typeof researchSchema>;
