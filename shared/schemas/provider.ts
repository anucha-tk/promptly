import { z } from 'zod';

/** Minimal provider shape for list/dropdown (e.g. booking form). */
export const providerSummarySchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

export type ProviderSummary = z.infer<typeof providerSummarySchema>;

/** Body for POST /api/providers. */
export const createProviderSchema = z.object({
  displayName: z.string().min(1, 'กรุณากรอกชื่อผู้ให้บริการ'),
  email: z.string().optional(),
});

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
