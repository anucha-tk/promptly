import { z } from 'zod';

/** Minimal provider shape for list/dropdown (e.g. booking form). */
export const providerSummarySchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

export type ProviderSummary = z.infer<typeof providerSummarySchema>;
